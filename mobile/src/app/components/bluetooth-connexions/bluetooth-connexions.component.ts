import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';


@Component({
  selector: 'app-bluetooth-connexions',
  templateUrl: './bluetooth-connexions.component.html',
  styleUrls: ['./bluetooth-connexions.component.scss'],
})
export class BluetoothConnexionsComponent {
  devices: any[] = [];
  connectedDeviceId: string | null = null;

  constructor(private ble:BLE, private NgZone:NgZone) { }
  
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
    alert('Connecté à' + peripheral);
    this.connectedDeviceId = peripheral.id;

  //   // Remplacez ces UUID par ceux spécifiques à votre casque
  // const serviceUUID = 'FD2A'; // Exemple pour le service d'informations sur le périphérique
  // const characteristicUUID = '1300 01F4 050F 0000 0100 00FD FD36 B100 00'; // Exemple pour la caractéristique de nom

  // // Essayez de lire une caractéristique pour vérifier la connexion
  // this.ble.read(peripheral.id, serviceUUID, characteristicUUID).then(
  //   data => {
  //     // Convertir les données en texte ou en format lisible
  //     const name = this.bytesToString(data);
  //     alert('Nom du périphérique:' + name);
  //   },
  //   error => console.error('Erreur lors de la lecture de la caractéristique', error)
  // );
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