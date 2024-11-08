import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RingtoneService {

  constructor(private http: HttpClient) { }

  uploadRingtone(formData: FormData) {
    return this.http.post(`${environment.api}/ringtones/upload`, formData);
  }
}
