import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent  implements OnInit {

  map?: GoogleMap;
  mapRefEl!: HTMLElement;

  @ViewChild('mapRef')
  set mapRef(ref: ElementRef<HTMLElement>) {
    this.mapRefEl = ref.nativeElement;
  }

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.createMap(this.mapRefEl);
  }

  async createMap(ref: HTMLElement) {
    this.map = await GoogleMap.create({
      id: 'map-test',
      element: ref,
      apiKey: environment.googleMapsKey,
      forceCreate: true,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 8,
      }
    });
  }
}
