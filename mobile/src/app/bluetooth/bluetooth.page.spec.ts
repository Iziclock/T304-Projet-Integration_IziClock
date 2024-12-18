import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BluetoothPage } from './bluetooth.page';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('BluetoothPage', () => {
  let component: BluetoothPage;
  let fixture: ComponentFixture<BluetoothPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Créer un spy pour Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      declarations: [BluetoothPage],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BluetoothPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('scanForDevices', () => {
    it('should start scanning and handle Bluetooth errors', async () => {
      spyOn(BleClient, 'initialize').and.returnValue(Promise.resolve());
      spyOn(BleClient, 'requestEnable').and.returnValue(Promise.reject()); // Simuler un échec de demande de Bluetooth

      await component.scanForDevices();

      expect(component.bluetoothErrorMessage).toBe('Activez le Bluetooth');
      expect(component.isScanning).toBeFalse();
    });
  });

  describe('onBluetoothDeviceFound', () => {
    it('should add a device to bluetoothDevices when called', () => {
      const mockDevice = { device: { deviceId: '123', name: 'Test Device' } } as ScanResult;
      component.onBluetoothDeviceFound(mockDevice);
      expect(component.bluetoothDevices.length).toBe(1);
      expect(component.bluetoothDevices[0]).toBe(mockDevice);
    });
  });

  describe('connectToDevice', () => {
    it('should connect to a device and display a connection message', async () => {
      const scanResult: ScanResult = { device: { deviceId: '1234', name: 'Test Device' } } as ScanResult;
      spyOn(BleClient, 'connect').and.returnValue(Promise.resolve());
      spyOn(window, 'alert');

      await component.connectToDevice(scanResult);

      expect(BleClient.connect).toHaveBeenCalledWith('1234', jasmine.any(Function));
      expect(window.alert).toHaveBeenCalledWith('Connected to device Test Device');
    });

    it('should set bluetoothConnectedDevice when connected', async () => {
      const scanResult: ScanResult = { device: { deviceId: '1234', name: 'Test Device' } } as ScanResult;
      spyOn(BleClient, 'connect').and.returnValue(Promise.resolve());

      await component.connectToDevice(scanResult);

      expect(component.bluetoothConnectedDevice).toBe(scanResult);
    });
  });

  describe('disconnectDevice', () => {
    it('should disconnect from a device', async () => {
      const mockDevice = { device: { deviceId: '123', name: 'Test Device' } } as ScanResult;
      spyOn(BleClient, 'disconnect').and.returnValue(Promise.resolve());

      await component.disconnectDevice(mockDevice);

      expect(BleClient.disconnect).toHaveBeenCalledWith(mockDevice.device.deviceId);
    });

    it('should handle disconnection correctly', () => {
      component.onBluetoothDeviceDisconnected('123');
      expect(component.bluetoothConnectedDevice).toBeUndefined();
    });
  });

  describe('sendWifiCredentials', () => {

    it('should show error when no device is connected', async () => {
      component.bluetoothConnectedDevice = undefined;
      spyOn(window, 'alert');

      try {
        await component.sendWifiCredentials('Test SSID', 'TestPassword');
      } catch (error) {
        expect(window.alert).toHaveBeenCalledWith('No device connected');
      }
    });
  });
});
