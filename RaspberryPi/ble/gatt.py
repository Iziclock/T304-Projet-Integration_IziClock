#!/usr/bin/python
from __future__ import print_function

import dbus
import dbus.exceptions
import dbus.mainloop.glib
import dbus.service

import array
import json

try:
  from gi.repository import GObject
except ImportError:
  import gobject as GObject
from gi.repository import GLib
from random import randint
import subprocess
import threading
import time

mainloop = None

BLUEZ_SERVICE_NAME = 'org.bluez'
GATT_MANAGER_IFACE = 'org.bluez.GattManager1'
DBUS_OM_IFACE = 'org.freedesktop.DBus.ObjectManager'
DBUS_PROP_IFACE = 'org.freedesktop.DBus.Properties'

GATT_SERVICE_IFACE = 'org.bluez.GattService1'
GATT_CHRC_IFACE = 'org.bluez.GattCharacteristic1'
GATT_DESC_IFACE = 'org.bluez.GattDescriptor1'


class InvalidArgsException(dbus.exceptions.DBusException):
    _dbus_error_name = 'org.freedesktop.DBus.Error.InvalidArgs'

class NotSupportedException(dbus.exceptions.DBusException):
    _dbus_error_name = 'org.bluez.Error.NotSupported'

class NotPermittedException(dbus.exceptions.DBusException):
    _dbus_error_name = 'org.bluez.Error.NotPermitted'

class InvalidValueLengthException(dbus.exceptions.DBusException):
    _dbus_error_name = 'org.bluez.Error.InvalidValueLength'

class FailedException(dbus.exceptions.DBusException):
    _dbus_error_name = 'org.bluez.Error.Failed'

class Application(dbus.service.Object):
    """
    org.bluez.GattApplication1 interface implementation
    """
    def __init__(self, bus):
        self.path = '/'
        self.services = []
        dbus.service.Object.__init__(self, bus, self.path)
        self.add_service(WifiService(bus, 1))

    def get_path(self):
        return dbus.ObjectPath(self.path)

    def add_service(self, service):
        self.services.append(service)

    @dbus.service.method(DBUS_OM_IFACE, out_signature='a{oa{sa{sv}}}')
    def GetManagedObjects(self):
        response = {}
        print('GetManagedObjects')

        for service in self.services:
            response[service.get_path()] = service.get_properties()
            chrcs = service.get_characteristics()
            for chrc in chrcs:
                response[chrc.get_path()] = chrc.get_properties()
                descs = chrc.get_descriptors()
                for desc in descs:
                    response[desc.get_path()] = desc.get_properties()

        return response

class Service(dbus.service.Object):
    """
    org.bluez.GattService1 interface implementation
    """
    PATH_BASE = '/org/bluez/example/service'

    def __init__(self, bus, index, uuid, primary):
        self.path = self.PATH_BASE + str(index)
        self.bus = bus
        self.uuid = uuid
        self.primary = primary
        self.characteristics = []
        dbus.service.Object.__init__(self, bus, self.path)

    def get_properties(self):
        return {
                GATT_SERVICE_IFACE: {
                        'UUID': self.uuid,
                        'Primary': self.primary,
                        'Characteristics': dbus.Array(
                                self.get_characteristic_paths(),
                                signature='o')
                }
        }

    def get_path(self):
        return dbus.ObjectPath(self.path)

    def add_characteristic(self, characteristic):
        self.characteristics.append(characteristic)

    def get_characteristic_paths(self):
        result = []
        for chrc in self.characteristics:
            result.append(chrc.get_path())
        return result

    def get_characteristics(self):
        return self.characteristics

    @dbus.service.method(DBUS_PROP_IFACE,
                         in_signature='s',
                         out_signature='a{sv}')
    def GetAll(self, interface):
        if interface != GATT_SERVICE_IFACE:
            raise InvalidArgsException()

        return self.get_properties()[GATT_SERVICE_IFACE]

class Characteristic(dbus.service.Object):
    """
    org.bluez.GattCharacteristic1 interface implementation
    """
    def __init__(self, bus, index, uuid, flags, service):
        self.path = service.path + '/char' + str(index)
        self.bus = bus
        self.uuid = uuid
        self.service = service
        self.flags = flags
        self.descriptors = []
        dbus.service.Object.__init__(self, bus, self.path)

    def get_properties(self):
        return {
                GATT_CHRC_IFACE: {
                        'Service': self.service.get_path(),
                        'UUID': self.uuid,
                        'Flags': self.flags,
                        'Descriptors': dbus.Array(
                                self.get_descriptor_paths(),
                                signature='o')
                }
        }

    def get_path(self):
        return dbus.ObjectPath(self.path)

    def add_descriptor(self, descriptor):
        self.descriptors.append(descriptor)

    def get_descriptor_paths(self):
        result = []
        for desc in self.descriptors:
            result.append(desc.get_path())
        return result

    def get_descriptors(self):
        return self.descriptors

    @dbus.service.method(DBUS_PROP_IFACE,
                         in_signature='s',
                         out_signature='a{sv}')
    def GetAll(self, interface):
        if interface != GATT_CHRC_IFACE:
            raise InvalidArgsException()

        return self.get_properties()[GATT_CHRC_IFACE]

    @dbus.service.method(GATT_CHRC_IFACE,
                        in_signature='a{sv}',
                        out_signature='ay')
    def ReadValue(self, options):
        print('Default ReadValue called, returning error')
        raise NotSupportedException()

    @dbus.service.method(GATT_CHRC_IFACE, in_signature='aya{sv}')
    def WriteValue(self, value, options):
        print('Default WriteValue called, returning error')
        raise NotSupportedException()

    @dbus.service.method(GATT_CHRC_IFACE)
    def StartNotify(self):
        print('Default StartNotify called, returning error')
        raise NotSupportedException()

    @dbus.service.method(GATT_CHRC_IFACE)
    def StopNotify(self):
        print('Default StopNotify called, returning error')
        raise NotSupportedException()

    @dbus.service.signal(DBUS_PROP_IFACE,
                         signature='sa{sv}as')
    def PropertiesChanged(self, interface, changed, invalidated):
        pass

class Descriptor(dbus.service.Object):
    """
    org.bluez.GattDescriptor1 interface implementation
    """
    def __init__(self, bus, index, uuid, flags, characteristic):
        self.path = characteristic.path + '/desc' + str(index)
        self.bus = bus
        self.uuid = uuid
        self.flags = flags
        self.chrc = characteristic
        dbus.service.Object.__init__(self, bus, self.path)

    def get_properties(self):
        return {
                GATT_DESC_IFACE: {
                        'Characteristic': self.chrc.get_path(),
                        'UUID': self.uuid,
                        'Flags': self.flags,
                }
        }

    def get_path(self):
        return dbus.ObjectPath(self.path)

    @dbus.service.method(DBUS_PROP_IFACE,
                         in_signature='s',
                         out_signature='a{sv}')
    def GetAll(self, interface):
        if interface != GATT_DESC_IFACE:
            raise InvalidArgsException()

        return self.get_properties()[GATT_DESC_IFACE]

    @dbus.service.method(GATT_DESC_IFACE,
                        in_signature='a{sv}',
                        out_signature='ay')
    def ReadValue(self, options):
        print('Default ReadValue called, returning error')
        raise NotSupportedException()

    @dbus.service.method(GATT_DESC_IFACE, in_signature='aya{sv}')
    def WriteValue(self, value, options):
        print('Default WriteValue called, returning error')
        raise NotSupportedException()

class WifiCharacteristic(Characteristic):
    WIFI_CHRC_UUID = '12345678-1234-5678-1234-56789abcdef1'

    def __init__(self, bus, index, service):
        Characteristic.__init__(self, bus, index, self.WIFI_CHRC_UUID, ['read','write'], service)
        self.value = []

    def ReadValue(self, options):
        """Obtenir le SSID actuel du Raspberry Pi"""
        try:
            result = subprocess.run(['iwgetid', '-r'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            if result.returncode != 0:
                print("Erreur dans l'exécution de iwgetid")
                return "Erreur: Impossible de récupérer le SSID".encode('utf-8')
            ssid = result.stdout.decode('utf-8').strip()
            return ssid.encode('utf-8') if ssid else "Erreur: Aucun SSID trouvé".encode('utf-8')
        except Exception as e:
            return f"Erreur: {str(e)}".encode('utf-8')

    def WriteValue(self, value, options):
        if self.service.ssid_written:
            print("SSID characteristic is not writable at this time. Waiting for timeout.")
            return

        # Set the SSID value and mark it as written
        try:
            data_str = ''.join([chr(byte) for byte in value])
            print(f"Received data: {data_str}")

            data = json.loads(data_str)

            if 'ssid' not in data or 'password' not in data:
                print("Invalid JSON: Missing 'ssid' or 'password'")
                return

            self.service.ssid = data['ssid']
            self.service.password = data['password']
            print(f"SSID set to: {self.service.ssid}")
            print(f"Password set to: {self.service.password}")
            self.service.ssid_written = True

            # Start timer to reset the flag after the specified timeout
            if self.service.ssid_timer is not None:
                self.service.ssid_timer.cancel()
            self.service.ssid_timer = threading.Timer(self.service.SSID_WRITE_TIMEOUT, self.service.reset_ssid_flag)
            self.service.ssid_timer.start()

            # Check if both SSID and password are available, then try to connect
            self.service.check_and_connect()
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")

class WifiDescriptor(Descriptor):
    """
    Dummy test descriptor. Returns a static value.

    """
    SSID_DESC_UUID = '12345678-1234-5678-1234-56789abcdef2'

    def __init__(self, bus, index, characteristic):
        Descriptor.__init__(
                self, bus, index,
                self.SSID_DESC_UUID,
                [ 'write'],
                characteristic)

    def ReadValue(self, options):
        return dbus.Array([dbus.Byte(ord(c)) for c in "SSID Write-Only"], signature='y')

class WifiDescriptionDescriptor(Descriptor):
    """
    Writable CUD descriptor.

    """
    CUD_UUID = '2901'

    def __init__(self, bus, index, characteristic):
        self.writable = 'writable-auxiliaries' in characteristic.flags
        self.value = array.array('B', b'This is a characteristic for ssid')
        self.value = self.value.tolist()
        Descriptor.__init__(
                self, bus, index,
                self.CUD_UUID,
                ['write'],
                characteristic)

    def ReadValue(self, options):
        return self.value

    def WriteValue(self, value, options):
        if not self.writable:
            raise NotPermittedException()
        self.value = value


class WifiService(Service):
    """
    Dummy test service that provides characteristics and descriptors that
    exercise various API functionality.

    """
    WIFI_SVC_UUID = '12345678-1234-5678-1234-56789abcdef0'
    SSID_WRITE_TIMEOUT = 60
    PASS_WRITE_TIMEOUT = 60

    def __init__(self, bus, index):
        Service.__init__(self, bus, index, self.WIFI_SVC_UUID, True)
        self.ssid_written = False
        self.ssid_timer = None
        self.pass_timer = None
        self.ssid = None
        self.password = None
        self.wifi_characteristic = WifiCharacteristic(bus, 0, self)
        self.add_characteristic(self.wifi_characteristic)

    def reset_ssid_flag(self):
        """Reset the ssid_written flag and allow SSID characteristic to be written again."""
        self.ssid_written = False
        print("SSID characteristic is now writable again.")

    def check_and_connect(self):
        """Checks if both SSID and password are available and then initiates Wi-Fi connection."""
        if self.ssid and self.password:
            print("Connecting to Wi-Fi with SSID and password.")
            self.connect_to_wifi()

    def connect_to_wifi(self):
        """Triggers the Wi-Fi connection using the saved SSID and password."""
        save_wifi_credentials(self.ssid, self.password)
        if self.ssid_timer is not None:
            self.ssid_timer.cancel()
        if self.pass_timer is not None:
            self.pass_timer.cancel()
        self.reset_ssid_flag()
        self.ssid = None
        self.password = None
        #print(f"Attempted to connect to Wi-Fi with SSID: {self.ssid}")


def register_app_cb():
    print('GATT application registered')

def register_app_error_cb(error):
    print('Failed to register application: ' + str(error))
    mainloop.quit()

def find_adapter(bus):
    remote_om = dbus.Interface(bus.get_object(BLUEZ_SERVICE_NAME, '/'), DBUS_OM_IFACE)
    objects = remote_om.GetManagedObjects()

    for o, props in objects.items():
        if GATT_MANAGER_IFACE in props:
            return o

    return None

def save_wifi_credentials(ssid=None, password=None):
    """
    Connect to a specific Wi-Fi network using nmcli. Waits until the connection is established
    before returning. After connecting, sets autoconnect no for all other networks, and autoconnect yes for the connected one.
    """
    subprocess.check_output(["sudo","nmcli","device","wifi","rescan"], text=True)
    if ssid is None or password is None:
        print("SSID and password are required.")
        return

    try:
        print(f"Searching for network {ssid}...")
        network_found = False
        for attempt in range(10):
            time.sleep(1)
            result = subprocess.check_output(["nmcli", "dev", "wifi"], text=True)
            if ssid in result:
                network_found = True
                print(f"Network {ssid} found.")
                break
            print(f"Attempt {attempt + 1}: Network {ssid} not found. Retrying...")

        if not network_found:
            print(f"Network {ssid} not found after multiple attempts.")
            return

        print(f"Attempting to connect to {ssid}...")
        subprocess.run(["nmcli", "dev", "wifi", "connect", ssid, "password", password], check=True)

        connected = False
        for attempt in range(10):
            time.sleep(1)
            status_result = subprocess.check_output(["nmcli", "-t", "-f", "STATE", "connection"], text=True)
            if "activated" in status_result:
                connected = True
                print(f"Successfully connected to {ssid}.")
                break
            print(f"Connection attempt {attempt + 1} failed. Retrying...")

        if not connected:
            print(f"Failed to connect to {ssid} after 30 seconds.")
            return


        print("Disabling autoconnect for all other Wi-Fi networks...")
        current_ssid = ssid
        for con in subprocess.check_output(["nmcli", "connection", "show"], text=True).splitlines():
            if "wifi" in con:
                connection_name = con.split()[0]

                result = subprocess.check_output(["nmcli", "connection", "show", connection_name], text=True)
                saved_ssid = None
                for line in result.splitlines():
                    if "ssid" in line:
                        saved_ssid = line.split(":")[1].strip()
                        break


                if saved_ssid and saved_ssid != current_ssid:
                    subprocess.run(["nmcli", "connection", "modify", connection_name, "connection.autoconnect", "no"], check=True)
                    print(f"Disabled autoconnect for {saved_ssid}.")
                elif saved_ssid == current_ssid:
                    subprocess.run(["nmcli", "connection", "modify", connection_name, "connection.autoconnect", "yes"], check=True)
                    print(f"Enabled autoconnect for {saved_ssid}.")

    except subprocess.CalledProcessError as e:
        print(f"Error during Wi-Fi connection: {e.stderr}")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")

def main():
    global mainloop

    dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)

    bus = dbus.SystemBus()

    adapter = find_adapter(bus)
    if not adapter:
        print('GattManager1 interface not found')
        return

    adapter_props = dbus.Interface(bus.get_object(BLUEZ_SERVICE_NAME, adapter), "org.freedesktop.DBus.Properties");

    adapter_props.Set("org.bluez.Adapter1", "Powered", dbus.Boolean(1))


    app = Application(bus)

    service_manager = dbus.Interface(
            bus.get_object(BLUEZ_SERVICE_NAME, adapter),
            GATT_MANAGER_IFACE)

    service_manager.RegisterApplication(app.get_path(), {},
                                    reply_handler=register_app_cb,
                                    error_handler=register_app_error_cb)

    mainloop = GLib.MainLoop()
    mainloop.run()

if __name__ == '__main__':
    main()