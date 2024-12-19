import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CalendarService } from './services/calendar.service';
import { AlarmService } from './services/alarm.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private authService:AuthService, private calendars:CalendarService,private alarms:AlarmService){} 
  ngOnInit() {
    if (localStorage.getItem("access_token") !==null){
      setInterval(() => {
        console.log("verif tt les secondes");
        //this.authService.checkLoggedIn();
        this.calendars.getCalendarsAPI().subscribe({
          next: () => {
            //window.location.reload();
            console.log("refreshed");
          },
          error: (err) => {
            console.error(`Error API calendars:`, err);
          }
        });
      },1000 * 30);
  }
}
}
