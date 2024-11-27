import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alarm, AlarmData } from '../interfaces/alarms';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  private baseUrl = `${environment.api}/alarms`;

  constructor(private http: HttpClient) {}

  getAlarms(): Observable<Alarm[]> {
    return this.http.get<Alarm[]>(this.baseUrl);
  }

  updateAlarmState(alarm: Alarm): Observable<Alarm> {
    return this.http.put<Alarm>(`${this.baseUrl}/state/${alarm.id}`, alarm).pipe(
      tap(data => console.log('Updated alarm:', data))
    );
  }

  updateAlarmDetails(alarm: AlarmData): Observable<AlarmData> {
    return this.http.put<AlarmData>(`${this.baseUrl}/${alarm.ID}`, alarm).pipe(
      tap(data => console.log('Updated alarm details:', data))
    );
  }

  getAlarmById(id: number): Observable<AlarmData> {
    return this.http.get<AlarmData>(`${this.baseUrl}/${id}`).pipe(
      tap(data => console.log('Fetched alarm:', data))
    );
  }
}