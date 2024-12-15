import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) { }

  getCalendars() {
    return this.http.get(`${environment.api}/calendars`, { withCredentials: true });
  }
  getCalendarsAPI(){
    return this.http.get(`${environment.api}/calendars/api`, { withCredentials: true });   
  }

  deleteCalendar(id: number) {
    return this.http.delete(`${environment.api}/calendars/${id}`, { withCredentials: true });
  }

  changeIsActiveState(id: number) {
    return this.http.put(`${environment.api}/calendars/state/${id}`, { withCredentials: true });
  }
}
