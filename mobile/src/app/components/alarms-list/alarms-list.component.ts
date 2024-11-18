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
  minDate: Date = new Date();
  maxDate: Date = new Date();
  disablePrevious: boolean = false;
  disableNext: boolean = false;

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

  setMinMaxDates() {
    const today = new Date();
    this.minDate.setDate(today.getDate() - 7);
    this.maxDate.setDate(today.getDate() + 7);
    this.updateButtonStates();
  }

  updateButtonStates() {
    this.disablePrevious = this.selectedDate <= this.minDate;
    this.disableNext = this.selectedDate >= this.maxDate;
  }

  filterAlarmsByDate() {
    this.filteredAlarms = this.alarms.filter(alarm => {
      const alarmDate = new Date(alarm.ringDate);
      return alarmDate.toDateString() === this.selectedDate.toDateString();
    });
  }

  previousDay() {
    if (!this.disablePrevious) {
      this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() - 1));
      this.filterAlarmsByDate();
      this.updateButtonStates();
    }
  }

  nextDay() {
    if (!this.disableNext) {
      this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() + 1));
      this.filterAlarmsByDate();
      this.updateButtonStates();
    }
  }

  onToggleChanged(alarm: Alarm, event: any) {
    const newState = event.detail.checked;
    alarm.active = newState;
  }

  ngOnInit() {
    this.setAlarms();
    this.setMinMaxDates();
  }
}