import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CalendarService } from './calendar.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { isPlatform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user:any;
  constructor(private calendars:CalendarService,private http: HttpClient,private platform: Platform) {
    if(!isPlatform('capacitor')){
      this.initializeApp();
    }
    this.initializeApp();
  }

  checkLoggedIn() {
    GoogleAuth.refresh()
        .then((data) => {
            if (data.accessToken) {
                console.log(data.accessToken) 
                localStorage.setItem("access_token",data.accessToken);
                this.calendars.getCalendarsAPI().subscribe({
                  next: () => {
                    window.location.reload();
                  },
                  error: (err) => {
                    console.error(`Error API calendars:`, err);
                  }
                });
            }
        })
        .catch((error) => {
            if (error.type === 'userLoggedOut') {
                this.googleSignIn()
            }
        });
  }

 

  async googleSignIn() {
    this.user = await GoogleAuth.signIn();
    return await this.user;
  }

  logout(){
    GoogleAuth.signOut();
    localStorage.removeItem("access_token");
  }

  initializeApp() {
    this.platform.ready().then(() => {
      GoogleAuth.initialize()
    })
  }
}