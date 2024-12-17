import { TestBed } from '@angular/core/testing';
import { BluetoothPage } from './bluetooth.page';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';
import { Router } from '@angular/router';

describe('BluetoothPage', () => {
  let component: BluetoothPage;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [BluetoothPage, { provide: Router, useValue: router }],
    });
    component = TestBed.inject(BluetoothPage);
  });

  it('should add a device to bluetoothDevices when onBluetoothDeviceFound is called', () => {
    const mockDevice = { device: { deviceId: '123', name: 'Test Device' } } as ScanResult;
    component.onBluetoothDeviceFound(mockDevice);
    expect(component.bluetoothDevices.length).toBe(1);
    expect(component.bluetoothDevices[0]).toBe(mockDevice);
  });

  it('should set isScanning to true and stop scanning after a timeout in scanForDevices', async () => {
    spyOn(BleClient, 'initialize').and.resolveTo();
    spyOn(BleClient, 'requestLEScan').and.resolveTo();
    spyOn(BleClient, 'stopLEScan').and.resolveTo();

    jasmine.clock().install();
    component.scanForDevices();

    expect(component.isScanning).toBeTrue();

    jasmine.clock().tick(5000);

    expect(BleClient.stopLEScan).toHaveBeenCalled();
    expect(component.isScanning).toBeFalse();
    jasmine.clock().uninstall();
  });

  it('should connect to a device and set bluetoothConnectedDevice', async () => {
    const mockDevice = { device: { deviceId: '123', name: 'Test Device' } } as ScanResult;
    spyOn(BleClient, 'connect').and.resolveTo();

    await component.connectToDevice(mockDevice);

    expect(BleClient.connect).toHaveBeenCalledWith(
      mockDevice.device.deviceId,
      jasmine.any(Function)
    );
    expect(component.bluetoothConnectedDevice).toBe(mockDevice);
  });

  it('should handle disconnection correctly', () => {
    component.onBluetoothDeviceDisconnected('123');
    expect(component.bluetoothConnectedDevice).toBeUndefined();
  });

  it('should disconnect from a device', async () => {
    const mockDevice = { device: { deviceId: '123', name: 'Test Device' } } as ScanResult;
    spyOn(BleClient, 'disconnect').and.resolveTo();

    await component.disconnectDevice(mockDevice);

    expect(BleClient.disconnect).toHaveBeenCalledWith(mockDevice.device.deviceId);
  });

  it('should send WiFi credentials and validate response', async () => {
    const mockDevice = { device: { deviceId: '123', name: 'Test Device' } } as ScanResult;
    const mockSSID = 'TestSSID';
    const mockPassword = 'TestPassword';

    component.bluetoothConnectedDevice = mockDevice;
    spyOn(BleClient, 'write').and.resolveTo();
    spyOn(BleClient, 'read').and.resolveTo(new DataView(new TextEncoder().encode(mockSSID).buffer));

    await component.sendWifiCredentials(mockSSID, mockPassword);

    expect(BleClient.write).toHaveBeenCalledWith(
      mockDevice.device.deviceId,
      component.SERVICE_UUID,
      component.CHARACTERISTIC_UUID,
      jasmine.any(DataView)
    );
    expect(BleClient.read).toHaveBeenCalledWith(
      mockDevice.device.deviceId,
      component.SERVICE_UUID,
      component.CHARACTERISTIC_UUID
    );
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  // it('should handle errors when sending WiFi credentials', async () => {
  //   const mockDevice = { device: { deviceId: '123', name: 'Test Device' } } as ScanResult;
  //   component.bluetoothConnectedDevice = mockDevice;
  //   spyOn(BleClient, 'write').and.rejectWith(new Error('Write Error'));

  //   try {
  //     await component.sendWifiCredentials('SSID', 'Password');
  //   } catch (error) {
  //     expect(error.message).toBe('Write Error');
  //   }
  // });
});