import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alarm } from '../../interfaces/alarms';
import { AlarmService } from 'src/app/services/alarm.service';
import { alarm } from 'src/app/classes/alarms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alarms-list',
  templateUrl: './alarms-list.component.html',
  styleUrls: ['./alarms-list.component.scss']
})
export class AlarmsListComponent implements OnInit, OnDestroy {
  alarms: Alarm[] = [];
  filteredAlarms: Alarm[] = [];
  selectedDate: Date = new Date();
  minDate: Date = new Date();
  maxDate: Date = new Date();
  disablePrevious: boolean = false;
  disableNext: boolean = false;
  subscription?: Subscription;

  constructor(private alarmService: AlarmService) {}

  setAlarms() {
    this.subscription = this.alarmService.alarms$.subscribe({
      next: (alarms: any) => {
        this.alarms= [];
        console.log('Alarms received in component:', alarms);
        for(let alarmData of alarms){
          
          const newAlarm = new alarm(alarmData);
          //console.log(newAlarm);
          this.alarms.push(newAlarm);
        }  
        this.filterAlarmsByDate();
        console.log('Alarms Length:', this.alarms.length);
      },
      error: (err) => {
        console.error('Error fetching alarms:', err);
      }
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
    this.alarmService.updateAlarmState(alarm).subscribe({
      error: (error) => {
        console.error('Error updating alarm state', error);
      }
    });
  }

  ngOnInit() {
    this.setAlarms();
    setInterval(() => {
      this.alarmService.getAlarms();
      
    }, 1000);
    
    this.setMinMaxDates();
    
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}