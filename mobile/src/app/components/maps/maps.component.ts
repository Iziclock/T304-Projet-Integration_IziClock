import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent  implements AfterViewInit {

  map!: GoogleMap;
  mapRefEl!: HTMLElement;

  @ViewChild('map')
  set mapRef(ref: ElementRef<HTMLElement>) {
    this.mapRefEl = ref.nativeElement;
  }

  constructor() { }

  ngAfterViewInit() {
    this.createMap(this.mapRefEl);
  }

  async createMap(ref: HTMLElement) {
    this.map = await GoogleMap.create({
      id: 'google-map',
      element: ref,
      apiKey: environment.googleMapsKey,
      forceCreate: true,
      config: {
        center: {
          lat: 50.66621288861961,
          lng: 4.612289912685951,
        },
        zoom: 17,
      }
    });
  }
}
