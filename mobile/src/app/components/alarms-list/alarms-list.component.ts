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
  filteredAlarms: Alarm[] = [];
  selectedDate: Date = new Date();

  constructor(private alarmService: AlarmService) {}

  setAlarms() {
    this.alarmService.getAlarms().subscribe((data: any) => {
      for (let alarmData of data) {
        const newAlarm: Alarm = new alarm(alarmData);
        this.alarms.push(newAlarm);
      }
      this.filterAlarmsByDate();
    });
  }

  filterAlarmsByDate() {
    this.filteredAlarms = this.alarms.filter(alarm => {
      const alarmDate = new Date(alarm.ringDate);
      return alarmDate.toDateString() === this.selectedDate.toDateString();
    });
  }

  previousDay() {
    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    this.selectedDate = new Date(this.selectedDate); 
    this.filterAlarmsByDate();
  }

  nextDay() {
    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    this.selectedDate = new Date(this.selectedDate); 
    this.filterAlarmsByDate();
  }

  onToggleChanged(alarm: Alarm, event: any) {
    const newState = event.detail.checked;
    alarm.active = newState;

    this.alarmService.updateAlarmState(alarm).subscribe(
      (updatedAlarm) => {
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'alarme:', error);
      }
    );
  }

  ngOnInit() {
    this.setAlarms();
  }
}