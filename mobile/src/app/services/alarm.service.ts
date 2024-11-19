import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alarm } from '../interfaces/alarms';
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
    console.log('Sending PUT request to update alarm:', alarm); // Affichez les détails de l'alarme envoyés dans la requête PUT
    return this.http.put<Alarm>(`${this.baseUrl}/state/${alarm.id}`, alarm).pipe(
      tap(data => console.log('Updated alarm:', data))
    );
  }

  updateAlarmDetails(alarm: Alarm): Observable<Alarm> {
    console.log('Sending PUT request to update alarm details:', alarm); // Affichez les détails de l'alarme envoyés dans la requête PUT
    return this.http.put<Alarm>(`${this.baseUrl}/${alarm.id}`, alarm).pipe(
      tap(data => console.log('Updated alarm details:', data))
    );
  }

  getAlarmById(id: number): Observable<Alarm> {
    console.log('Fetching alarm by ID:', id);
    return this.http.get<Alarm>(`${this.baseUrl}/${id}`).pipe(
      tap(data => console.log('Fetched alarm:', data)) // Ajoutez ce log
    );
  }
}