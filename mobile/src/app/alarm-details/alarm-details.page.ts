import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlarmService } from 'src/app/services/alarm.service';
import { Alarm } from 'src/app/interfaces/alarms';

@Component({
  selector: 'app-alarm-details',
  templateUrl: './alarm-details.page.html',
  styleUrls: ['./alarm-details.page.scss'],
})
export class AlarmDetailsPage implements OnInit {
  alarmId: number = 0;
  alarmDetails: Alarm = {} as Alarm;

  constructor(private route: ActivatedRoute, private router: Router, private alarmService: AlarmService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alarmId = +id;
      this.getAlarmDetails(this.alarmId);
    }
  }

  getAlarmDetails(id: number) {
    this.alarmService.getAlarmById(id).subscribe(
      (data: Alarm) => {
        this.alarmDetails = data;
      },
      (error) => {
        console.error('Error fetching alarm details', error);
      }
    );
  }

  editAlarm() {
    this.router.navigate(['/edit-alarm', this.alarmId]);
  }
  goBack() {
    this.router.navigate(['/home']); // Remplacez 'alarm-home' par le chemin correct de votre page d'accueil des alarmes
  }
}