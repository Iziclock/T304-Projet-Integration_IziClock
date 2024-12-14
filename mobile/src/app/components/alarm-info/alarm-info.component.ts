import { Component, OnInit, Input } from '@angular/core';
import { AlarmService } from 'src/app/services/alarm.service';
import { Alarm } from 'src/app/interfaces/alarms';
import { alarm } from 'src/app/classes/alarms';
import { GeoapifyService } from 'src/app/services/geoapify.service';
import { Coordinates } from 'src/app/types/coordinates';
import { combineLatestWith, Observable } from 'rxjs';

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
  estimatedTime: number | null = null;

  constructor(private alarmService: AlarmService, private geoapifyService: GeoapifyService) {}

  ngOnInit() {
    this.getAlarmDetails(this.alarmId);
  }

  getAlarmDetails(id: number) {
    this.alarmService.getAlarmById(id).subscribe(
      (data: any) => {
        const newAlarm: Alarm = new alarm(data);
        if (newAlarm.locationStart && newAlarm.locationEnd) {
          const coordinatesStart: Observable<any> = this.geoapifyService.getCoordinates(newAlarm.locationStart);
          const coordinatesEnd: Observable<any> = this.geoapifyService.getCoordinates(newAlarm.locationEnd);
          coordinatesStart.pipe(combineLatestWith(coordinatesEnd)).subscribe(([start, end]) => {
            //console.log(start['results'][0], end['results'][0]);
            const startFormatted: Coordinates = {
              lat: start['results'][0]['lat'],
              lon: start['results'][0]['lon']
            };
            const endFormatted: Coordinates = {
              lat: end['results'][0]['lat'],
              lon: end['results'][0]['lon']
            };
            this.geoapifyService.getRoute(startFormatted, endFormatted, newAlarm.transport? newAlarm.transport : 'drive').subscribe(time => {
              this.estimatedTime = time['features'][0]['properties']['time'];
            });
          });
        }
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