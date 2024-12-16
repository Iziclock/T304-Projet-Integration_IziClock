import { Component, OnInit } from '@angular/core';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})
export class BluetoothPage implements OnInit {
  bluetoothDevices: ScanResult[] = [];
  isScanning = false;
  bluetoothConnectedDevice?: ScanResult;

  SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
  CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';

  constructor() { }

  async scanForDevices() {
    try {
      await BleClient.initialize({ androidNeverForLocation: true });

      this.bluetoothDevices = [];
      this.isScanning = true;

      await BleClient.requestLEScan(
        { services: [this.SERVICE_UUID] },
        this.onBluetoothDeviceFound.bind(this)
      );

      const stopScanAfterMs = 5000;
      setTimeout(async () => {
        await BleClient.stopLEScan();
        this.isScanning = false;
      }, stopScanAfterMs);
    } catch (error) {
      this.isScanning = false;
      console.error('Error initializing BLE', error);
    }
  }

  async onBluetoothDeviceFound(device: ScanResult) {
    console.log('Found device', device);
    this.bluetoothDevices.push(device);
  }

  async connectToDevice(scanResult: ScanResult) {
    const device = scanResult.device

    try {
      await BleClient.connect(
        device.deviceId,
        this.onBluetoothDeviceDisconnected.bind(this)
      );

      setTimeout('', 15000);

      this.bluetoothConnectedDevice = scanResult;

      const deviceName = device.name ?? device.deviceId;
      alert(`Connected to device ${deviceName}`);
    } catch (error) {
      console.error('Error connecting to device', error);
    }
  }

  onBluetoothDeviceDisconnected(disconnectedDeviceId: string) {
    alert(`Device ${disconnectedDeviceId} disconnected`);
    this.bluetoothConnectedDevice = undefined;
  }

  async disconnectDevice(scanResult: ScanResult) {
    const device = scanResult.device;

    try {
      await BleClient.disconnect(device.deviceId);
      const deviceName = device.name ?? device.deviceId;
      alert(`Disconnected from device ${deviceName}`);
    } catch (error) {
      console.error('Error disconnecting from device', error);
    }
  }

  ngOnInit() {
  }

}
