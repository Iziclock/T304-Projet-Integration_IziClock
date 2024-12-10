import { Component, OnInit, Input } from '@angular/core';
import { AlarmService } from 'src/app/services/alarm.service';
import { Alarm } from 'src/app/interfaces/alarms';
import { alarm } from 'src/app/classes/alarms';

@Component({
  selector: 'app-alarm-info',
  templateUrl: './alarm-info.component.html',
  styleUrls: ['./alarm-info.component.scss'],
})
export class AlarmInfoComponent implements OnInit {
  @Input() alarmId: number = 0; // Initialisation à 0
  alarmDetails: Alarm = {} as Alarm; // Initialisation à un objet vide
  transportModes: { [key: string] : string} = {
    drive: 'car',
    walk: 'walk',
    bicycle: 'bicycle',
    approximated_transit: 'subway',
  };

  constructor(private alarmService: AlarmService) {}

  ngOnInit() {
    this.getAlarmDetails(this.alarmId);
  }

  getAlarmDetails(id: number) {
    this.alarmService.getAlarmById(id).subscribe(
      (data: any) => {
        const newAlarm: Alarm = new alarm(data);
        this.alarmDetails=(newAlarm);
      },
      (error) => {
        console.error('Error fetching alarm details', error);
      }
    );
  }

  getTransportIcon(): string {
    //console.log(this.transportModes[this.alarmDetails.transport]);
    return this.transportModes[this.alarmDetails.transport];
  }
}