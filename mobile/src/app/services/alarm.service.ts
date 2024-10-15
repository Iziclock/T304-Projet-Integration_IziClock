import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  
  constructor(private http: HttpClient) { }

  getAlarms() {
    return this.http.get(`${environment.api}/alarms`);
  }
}
