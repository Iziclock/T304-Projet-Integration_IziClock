import { Plugins } from '@capacitor/core';
const { Permissions } = Plugins;

import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';


@Component({
  selector: 'app-bluetooth-connexions',
  templateUrl: './bluetooth-connexions.component.html',
  styleUrls: ['./bluetooth-connexions.component.scss'],
})
export class BluetoothConnexionsComponent implements OnInit {
  devices: any[] = [];
  connectedDeviceId: string | null = null;

  async requestBluetoothPermissions() {
    const permissions = await Permissions['requestPermissions']({
      permissions: [
        'android.permission.BLUETOOTH_SCAN',
        'android.permission.BLUETOOTH_CONNECT',
        'android.permission.ACCESS_FINE_LOCATION',
      ],
    });
    console.log('Permissions Bluetooth :', permissions);
  }

  constructor(private ble:BLE, private NgZone:NgZone) { }
  ngOnInit(): void {
    this.requestBluetoothPermissions();
  }
  
  Scan() {
    this.devices = [];
    this.ble.scan([], 30).subscribe(
      device => this.onDeviceDiscovered(device),
      error => console.error('Erreur lors du scan', error)
    )
  }

  onDeviceDiscovered(device: any) {
    if (device.name) {
      this.NgZone.run(() => {
        this.devices.push(device);
      });
    }
  }

  connect(deviceId: string) {
    this.ble.connect(deviceId).subscribe(
      peripheral => this.onConnected(peripheral),
      error => console.error('Erreur lors de la connexion', error)
    );
  }
  
  onConnected(peripheral: any) {
    let alerte = ""
    for(let i in peripheral.characteristics){
      alerte += "Connecté à \n" + "Service : " + peripheral.characteristics[i].service + "\n Characteristic_Id = " + peripheral.characteristics[i].characteristic + "\n properties : " + peripheral.characteristics[i].properties + "\n"
    }
    alert(alerte);
    this.connectedDeviceId = peripheral.id;

  // Essayer de lire des services standards
  const serviceId = '1800';
  const charId = '2a01';

  this.ble.read(this.connectedDeviceId!, serviceId, charId).then(
    data => {
      alert('Nom du fabricant:' + this.bytesToString(data));
    },
    error => alert('Erreur lors de la lecture de la caractéristique du nom du fabricant : ' + error)
  );


  }

  disconnect(deviceId: string) {
    this.ble.disconnect(deviceId).then(
      () => {
        alert('Déconnecté de' + deviceId);
        this.connectedDeviceId = null; // Réinitialise l'ID de l'appareil connecté
      },
      error => console.error('Erreur lors de la déconnexion', error)
    );
  }

  private bytesToString(buffer: any) {
    let string = '';
    const dataArray = new Uint8Array(buffer);
    for (let i = 0; i < dataArray.length; i++) {
      string += String.fromCharCode(dataArray[i]);
    }
    return string;
  }
}