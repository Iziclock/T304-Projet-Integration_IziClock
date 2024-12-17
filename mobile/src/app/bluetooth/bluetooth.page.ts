import { Component, OnInit } from '@angular/core';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})
export class BluetoothPage implements OnInit {
  bluetoothDevices: ScanResult[] = [];
  isScanning = false;
  bluetoothConnectedDevice?: ScanResult;

  ssid = '';
  password = '';

  SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
  CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';

  constructor(private router: Router) {}

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
      setInterval(() => this.maintainConnection(), 2000); // Ping toutes les 2 secondes
    } catch (error) {
      console.error('Error connecting to device', error);
    }
  }

  async maintainConnection() {
    if (!this.bluetoothConnectedDevice?.device.deviceId) return;
  
    try {
      const value = await BleClient.read(
        this.bluetoothConnectedDevice.device.deviceId,
        this.SERVICE_UUID,
        this.CHARACTERISTIC_UUID
      );
      console.log('Maintaining connection, value read:', new TextDecoder().decode(value.buffer));
    } catch (error) {
      console.error('Error maintaining connection:', error);
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

  async sendWifiCredentials(ssid: string, password: string): Promise<void> {
    if (!this.bluetoothConnectedDevice?.device.deviceId) {
      alert('No device connected');
      throw new Error('No device connected');
    }

    try {
      const credentials = JSON.stringify({ ssid, password });
      const encoded = new TextEncoder().encode(credentials);

      await BleClient.write(
        this.bluetoothConnectedDevice?.device.deviceId,
        this.SERVICE_UUID,
        this.CHARACTERISTIC_UUID,
        new DataView(encoded.buffer)
      );

      // Ajouter un délai pour donner le temps au Raspberry Pi de répondre
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      alert('WiFi credentials sent successfully');

      try {
        const value = await BleClient.read(
          this.bluetoothConnectedDevice.device.deviceId,
          this.SERVICE_UUID,
          this.CHARACTERISTIC_UUID
        );
    
        const ssid_read = new TextDecoder().decode(value.buffer);
    
        if (this.ssid === ssid_read) {
          this.router.navigate(['/home']);
        } else {
          alert('Les SSID ne correspondent pas');
        }
    
      } catch (error) {
        console.error('Erreur lors de la lecture du SSID', error);
        alert('Erreur lors de la lecture du SSID');
      }

    } catch (error) {
      alert(`Error sending WiFi credentials ${error}`);
      throw error;
    }
  }
  
  ngOnInit() {
  }

}
