import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginGoogleService {

  constructor(private http: HttpClient) { }

  getLogin(){
    return this.http.get(`${environment.api}/calendars/login`,{ responseType: 'text' as 'json' })
  }
}
