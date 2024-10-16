import { Component, OnInit } from '@angular/core';
import { Calendar } from 'src/app/interfaces/calendars';

@Component({
  selector: 'app-calendars-management',
  templateUrl: './calendars-management.component.html',
  styleUrls: ['./calendars-management.component.scss'],
})
export class CalendarsManagementComponent  implements OnInit {

  calendars: Calendar[] = [
    {
      id: 1,
      name: 'example@hotmail.com',
      url: 'https://example.com/calendar1'
    },
    {
      id: 2,
      name: 'example@gmail.com',
      url: 'https://example.com/calendar2'
    },
    {
      id: 3,
      name: 'example@skynet.com',
      url: 'https://example.com/calendar3'
    }
  ];

  constructor() {}

  ngOnInit() {}

}
