import { Component, OnInit } from '@angular/core';
import { calendar } from 'src/app/classes/calendars';
import { Calendar } from 'src/app/interfaces/calendars';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-calendars-management',
  templateUrl: './calendars-management.component.html',
  styleUrls: ['./calendars-management.component.scss'],
})
export class CalendarsManagementComponent  implements OnInit {
  calendars: Calendar[] = [];

  constructor(private calendarService: CalendarService) {

  }
  
  setCalendars(){
    this.calendarService.getCalendars().subscribe((data: any) => {
      console.log(data);
      for (let calendarData of data) {
        let newCalendar: Calendar = new calendar(calendarData);
        this.calendars.push(newCalendar);
      }
      console.log(this.calendars);
    });
  }

  deleteCalendar(id: number){
    this.calendars = this.calendars.filter(calendar => calendar.id !== id);

    this.calendarService.deleteCalendar(id).subscribe();
  }

  ngOnInit() {
    this.setCalendars();
  }

}
