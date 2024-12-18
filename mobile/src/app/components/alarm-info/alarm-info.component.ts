import { Component, OnInit, Input } from '@angular/core';
import { AlarmService } from 'src/app/services/alarm.service';
import { Alarm } from 'src/app/interfaces/alarms';
import { alarm } from 'src/app/classes/alarms';
import { GeoapifyService } from 'src/app/services/geoapify.service';
import { Coordinates } from 'src/app/types/coordinates';
import { combineLatestWith, Observable } from 'rxjs';
import { RingdatePipe } from 'src/app/pipes/ringdate.pipe';

@Component({
  selector: 'app-alarm-info',
  templateUrl: './alarm-info.component.html',
  styleUrls: ['./alarm-info.component.scss']
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
  estimatedTime: number | null = null;
  ringTime: Date | null = null;

  constructor(private alarmService: AlarmService, private geoapifyService: GeoapifyService) {}

  ngOnInit() {
    this.getAlarmDetails(this.alarmId);
  }

  async getAlarmDetails(id: number) {
    try {
      const data: any = await this.alarmService.getAlarmById(id).toPromise();
      const newAlarm: Alarm = new alarm(data);

      this.alarmDetails = newAlarm;
  
      if (newAlarm.locationStart && newAlarm.locationEnd) {
        const coordinatesStart: any = await this.geoapifyService.getCoordinates(newAlarm.locationStart).toPromise();
        const coordinatesEnd: any = await this.geoapifyService.getCoordinates(newAlarm.locationEnd).toPromise();
  
        const startFormatted: Coordinates = {
          lat: coordinatesStart['results'][0]['lat'],
          lon: coordinatesStart['results'][0]['lon']
        };
        const endFormatted: Coordinates = {
          lat: coordinatesEnd['results'][0]['lat'],
          lon: coordinatesEnd['results'][0]['lon']
        };
  
        const route: any = await this.geoapifyService.getRoute(startFormatted, endFormatted, newAlarm.transport ? newAlarm.transport : 'drive').toPromise();
        this.estimatedTime = route['features'][0]['properties']['time'];
      }
  
      this.ringTime = this.calculateRingingTime(newAlarm.ringDate, newAlarm.preparationTime, this.estimatedTime);
    } catch (error) {
      console.error('Error fetching alarm details', error);
    }
  }

  getTransportIcon(): string {
    //console.log(this.transportModes[this.alarmDetails.transport]);
    return this.transportModes[this.alarmDetails.transport];
  }

  calculateRingingTime(ringDate: Date, preparationTime: number, estimatedTime: number | null): Date {
    const ringTime = new Date(ringDate);
    ringTime.setMinutes(ringTime.getMinutes() - preparationTime);
  
    if (estimatedTime !== null) {
      const estimatedTimeInMinutes = estimatedTime / 60;
      ringTime.setMinutes(ringTime.getMinutes() - estimatedTimeInMinutes);
    }
  
    return ringTime;
  }
}