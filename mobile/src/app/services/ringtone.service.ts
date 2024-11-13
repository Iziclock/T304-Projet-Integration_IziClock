import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Ringtone } from '../interfaces/ringtones';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RingtoneService {

  constructor(private http: HttpClient) { }

  getRingtones() {
    return this.http.get(`${environment.api}/ringtones`);
  }
  
  uploadRingtone(formData: FormData) {
    return this.http.post(`${environment.api}/ringtones/upload`, formData);
  }

  updateRingtoneName(id: number, name: string) {
    return this.http.put(`${environment.api}/ringtones/name/${id}`, { name });
  }
}
