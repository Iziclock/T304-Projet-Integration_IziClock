import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlarmService } from 'src/app/services/alarm.service';
import { Alarm } from 'src/app/interfaces/alarms';

@Component({
  selector: 'app-edit-alarm',
  templateUrl: './edit-alarm.page.html',
  styleUrls: ['./edit-alarm.page.scss'],
})
export class EditAlarmPage implements OnInit {
  alarmId: number = 0;
  alarmDetails: Alarm = {} as Alarm;

  constructor(private route: ActivatedRoute, private alarmService: AlarmService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alarmId = +id;
      this.getAlarmDetails(this.alarmId);
    }
  }

  getAlarmDetails(id: number) {
    this.alarmService.getAlarmById(id).subscribe(
      (data: any) => {
        this.alarmDetails = data;
      },
      (error) => {
        console.error('Error fetching alarm details', error);
      }
    );
  }

  saveAlarm() {
    this.alarmService.updateAlarmState(this.alarmDetails).subscribe(
      (data: any) => {
        console.log('Alarm updated successfully', data);
      },
      (error) => {
        console.error('Error updating alarm', error);
      }
    );
  }
}