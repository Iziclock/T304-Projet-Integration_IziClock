import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.api}/users`;

  constructor(private http: HttpClient) { }

  getUser() {
    return this.http.get(`${this.baseUrl}`);
  }

  updateUser(user: any) {
    return this.http.put(`${this.baseUrl}`, user);
  }
}
