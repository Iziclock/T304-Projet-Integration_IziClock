import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) { }

  getCalendars() {
    return this.http.get(`${environment.api}/calendars`, { withCredentials: true });
  }
  getCalendarsAPI() : Observable<any> {
    return this.http.get(`${environment.api}/calendars/api`, { withCredentials: true });   
  }

  refreshCalendarsAPI(time:number): Observable<any> {
    return new Observable((subscriber) => {
      const fetchData = () => {
        this.getCalendarsAPI().subscribe({
          next: (data) => subscriber.next(data),
          error: (err) => subscriber.error(err), 
        });
      };
      fetchData();
      const interval = setInterval(fetchData, time);
      return () => clearInterval(interval);
    });
  }


  postToken(token: string) {
    return this.http.post(`${environment.api}/calendars/token`, JSON.stringify(token), { headers: { 'Content-Type': 'application/json' } });
  }

  deleteCalendar(id: number) {
    return this.http.delete(`${environment.api}/calendars/${id}`, { withCredentials: true });
  }

  changeIsActiveState(id: number) {
    return this.http.put(`${environment.api}/calendars/state/${id}`, { withCredentials: true });
  }
}
