import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coordinates } from '../types/coordinates';

@Injectable({
  providedIn: 'root'
})
export class GeoapifyService {
  private geocodeBaseUrl: string = 'https://api.geoapify.com/v1/geocode/';
  private routeBaseUrl: string = 'https://api.geoapify.com/v1/routing/';

  constructor(private http: HttpClient) { }

  getCoordinates(location: string): Observable<any> {
    const formattedLocation: string = location.replace(' ', '%20').replace(',', '%2C');
    const url = `${this.geocodeBaseUrl}search?text=${formattedLocation}&format=json&apiKey=${environment.geoapifyKey}`;
    return this.http.get<any>(url);
  }

  getAddress(lat: number, lon: number): Observable<any> {
    const url = `${this.geocodeBaseUrl}reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${environment.geoapifyKey}`;
    return this.http.get<any>(url);
  }

  getRoute(start: Coordinates, end: Coordinates, mode: string): Observable<any> {
    const url = `${this.routeBaseUrl}?waypoints=${start.lat},${start.lon}|${end.lat},${end.lon}&traffic=approximated&mode=${mode}&apiKey=${environment.geoapifyKey}`;
    return this.http.get<any>(url);
  }
}
