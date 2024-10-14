import { Component, OnInit } from '@angular/core';
import { Alarm } from '../../interfaces/alarms';
import { AlarmService } from 'src/app/services/alarm.service';
import { alarm } from 'src/app/classes/alarms';

@Component({
  selector: 'app-alarms-list',
  templateUrl: './alarms-list.component.html',
  styleUrls: ['./alarms-list.component.scss']
})
export class AlarmsListComponent implements OnInit {
  alarms: Alarm[] = [];

  constructor(private alarmService: AlarmService) {

  }
  
  setAlarms(){
    this.alarmService.getAlarms().subscribe((data: any) => {
      console.log(data);
      for (let alarmData of data) {
        let newAlarm: Alarm = new alarm(alarmData);
        this.alarms.push(newAlarm);
      }
      console.log(this.alarms);
    });
  }

  ngOnInit() {
    this.setAlarms();
  }

}