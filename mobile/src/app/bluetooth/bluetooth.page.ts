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
  bluetoothErrorMessage: string = '';

  SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
  CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';

  constructor(private router: Router) {}

  doRefresh(event: any) {
    window.location.reload();

    event.target.complete();
  }

  async scanForDevices() {
    try {
      this.bluetoothErrorMessage = ''; // Réinitialiser le message d'erreur
      await BleClient.initialize({ androidNeverForLocation: true });
  
      // Vérifiez si le Bluetooth est activé
      try {
        await BleClient.requestEnable();
      } catch (error) {
        this.bluetoothErrorMessage = 'Activez le Bluetooth'; // Affiche un message si l'utilisateur refuse d'activer le Bluetooth
        return; // Arrêter la méthode si le Bluetooth n'est pas activé
      }
  
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
      this.bluetoothErrorMessage = 'Une erreur est survenue lors de l\'initialisation du scan Bluetooth.';
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
    if (!this.bluetoothConnectedDevice || !this.bluetoothConnectedDevice.device.deviceId) {
      alert('No device connected');
      throw new Error('No device connected');
    }
  
    let writeError: any = null; // Variable pour capturer une éventuelle erreur lors de l'écriture
  
    try {
      const credentials = JSON.stringify({ ssid, password });
      const encoded = new TextEncoder().encode(credentials);
  
      // Tentative d'écriture
      try {
        await BleClient.write(
          this.bluetoothConnectedDevice.device.deviceId,
          this.SERVICE_UUID,
          this.CHARACTERISTIC_UUID,
          new DataView(encoded.buffer)
        );
      } catch (error: any) {
        writeError = error;
        if (!error.message?.includes('write timeout')) {
          throw error; // Si ce n'est pas un timeout, relancer l'erreur
        }
        console.warn('Write timeout occurred, proceeding to read...');
      }
    } finally {
      // Attendre 15 secondes avant de lire la caractéristique pour laisser le Raspberry se connecter
      setTimeout(async () => {
        try {
          const value = await BleClient.read(
            this.bluetoothConnectedDevice!.device.deviceId, // Ici, on sait que l'objet existe
            this.SERVICE_UUID,
            this.CHARACTERISTIC_UUID
          );
  
          const ssid_read = new TextDecoder().decode(value.buffer);
  
          if (this.ssid === ssid_read) {
            this.router.navigate(['/home']); // Redirection vers la page d'accueil
          } else {
            alert('Pas possible de se connecter car : Les SSID ne correspondent pas');
          }
        } catch (readError) {
          console.error('Erreur lors de la lecture du SSID', readError);
          alert('Erreur lors de la lecture du SSID');
        }
      }, 12000); // Délai de 15 secondes
    }
  }
  
  
  

  // async verif() {
  //   // Vérifier si un appareil est connecté
  //   if (!this.bluetoothConnectedDevice?.device.deviceId) {
  //     alert('Aucun appareil connecté');
  //     return;
  //   }
  
  //   try {
  //     // Lire la caractéristique contenant le SSID actuel
  //     const value = await BleClient.read(
  //       this.bluetoothConnectedDevice.device.deviceId,
  //       this.SERVICE_UUID,
  //       this.CHARACTERISTIC_UUID
  //     );
  
  //     // Décoder la valeur de la caractéristique en UTF-8
  //     const ssid_read = new TextDecoder().decode(value.buffer);
  //     console.log(`SSID actuel lu : ${ssid_read}`);
  //     alert(`SSID actuel : ${ssid_read}`);
  
  //     // Comparer le SSID envoyé avec le SSID lu
  //     if (this.ssid === ssid_read) {
  //       alert('Tout fonctionne ! Le SSID correspond');
  //     } else {
  //       alert('Les SSID ne correspondent pas');
  //     }
  
  //   } catch (error) {
  //     console.error('Erreur lors de la lecture du SSID', error);
  //     alert('Erreur lors de la lecture du SSID');
  //   }
  // }
  
  
  ngOnInit() {
  }

}