import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Alarm } from '../interfaces/alarms';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  
  constructor(private http: HttpClient) { }

  getAlarms() {
    return this.http.get(`${environment.api}/alarms`);
  }

  updateAlarmState(alarm: Alarm) {
    return this.http.put(`${environment.api}/alarms/state/${alarm.id}`, {});
  }
}
