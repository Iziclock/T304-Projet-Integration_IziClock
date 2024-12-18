import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { Alarm, AlarmData } from '../interfaces/alarms';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  private baseUrl = `${environment.api}/alarms`;
  private alarmsSubject = new BehaviorSubject<Alarm[]>([]);
  alarms$ = this.alarmsSubject.asObservable();
  constructor(private http: HttpClient) {}

  getAlarms(){
    this.http.get<Alarm[]>(`${this.baseUrl}`).subscribe({
      next: (alarms) => {
        console.log('Fetched alarms:', alarms);
        this.alarmsSubject.next(alarms);  
      },
      error: (err) => {
        console.error('Error fetching alarms:', err);
      }
    });
  }

  updateAlarmState(alarm: Alarm): Observable<Alarm> {
    return this.http.put<Alarm>(`${this.baseUrl}/state/${alarm.id}`, alarm).pipe(
      //tap(data => console.log('Updated alarm:', data))
    );
  }

  updateAlarmDetails(alarm: AlarmData): Observable<AlarmData> {
    return this.http.put<AlarmData>(`${this.baseUrl}/${alarm.ID}`, alarm).pipe(
      //tap(data => console.log('Updated alarm details:', data))
    );
  }

  getAlarmById(id: number): Observable<AlarmData> {
    return this.http.get<AlarmData>(`${this.baseUrl}/${id}`).pipe(
      //tap(data => console.log('Fetched alarm:', data))
    );
  }
}