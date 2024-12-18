import dbus
import dbus.exceptions
import dbus.mainloop.glib
import dbus.service
from gi.repository import GLib

BLUEZ_SERVICE_NAME = 'org.bluez'
ADAPTER_IFACE = 'org.bluez.Adapter1'
LE_ADVERTISEMENT_IFACE = 'org.bluez.LEAdvertisement1'
DBUS_PROP_IFACE = 'org.freedesktop.DBus.Properties'

class Advertisement(dbus.service.Object):
    PATH_BASE = '/org/bluez/example/advertisement'

    def __init__(self, bus, index, advertising_type):
        self.path = self.PATH_BASE + str(index)
        self.bus = bus
        self.ad_type = advertising_type
        self.service_uuids = None
        self.local_name = None
        dbus.service.Object.__init__(self, bus, self.path)

    def get_path(self):
        return dbus.ObjectPath(self.path)

    def add_service_uuid(self, uuid):
        if not self.service_uuids:
            self.service_uuids = []
        self.service_uuids.append(uuid)

    def set_local_name(self, name):
        self.local_name = name

    @dbus.service.method(DBUS_PROP_IFACE,
                         in_signature='ss', out_signature='v')
    def Get(self, interface, prop):
        if interface != LE_ADVERTISEMENT_IFACE:
            raise dbus.exceptions.DBusException(
                    'org.freedesktop.DBus.Error.InvalidArgs')
        return getattr(self, prop)

    @dbus.service.method(DBUS_PROP_IFACE,
                         in_signature='s', out_signature='a{sv}')
    def GetAll(self, interface):
        if interface != LE_ADVERTISEMENT_IFACE:
            raise dbus.exceptions.DBusException(
                    'org.freedesktop.DBus.Error.InvalidArgs')
        return {
            'Type': self.ad_type,
            'ServiceUUIDs': self.service_uuids,
            'LocalName': self.local_name,
        }

    @dbus.service.method(LE_ADVERTISEMENT_IFACE)
    def Release(self):
        print('%s: Released!' % self.path)

def register_ad_cb():
    print("Publicité BLE activée.")

def register_ad_error_cb(error):
    print("Erreur d'activation BLE :", error)
    mainloop.quit()

dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
bus = dbus.SystemBus()

# Utilisation de org.freedesktop.DBus.Properties pour régler Powered sur True
props = dbus.Interface(bus.get_object(BLUEZ_SERVICE_NAME, '/org/bluez/hci0'),
                       'org.freedesktop.DBus.Properties')
props.Set(ADAPTER_IFACE, "Powered", dbus.Boolean(1))

advertisement = Advertisement(bus, 0, 'peripheral')
advertisement.set_local_name("iziclock")
advertisement.add_service_uuid("12345678-1234-5678-1234-56789abcdef0")

ad_manager = dbus.Interface(bus.get_object(BLUEZ_SERVICE_NAME, '/org/bluez/hci0'),
                            'org.bluez.LEAdvertisingManager1')
ad_manager.RegisterAdvertisement(advertisement.get_path(), {},
                                 reply_handler=register_ad_cb,
                                 error_handler=register_ad_error_cb)

mainloop = GLib.MainLoop()
mainloop.run()