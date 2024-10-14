import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  API_url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAlarms() {
    return this.http.get(`${this.API_url}/alarms`);
  }
}
