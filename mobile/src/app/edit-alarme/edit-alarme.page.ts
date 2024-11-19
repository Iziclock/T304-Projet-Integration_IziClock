import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlarmService } from 'src/app/services/alarm.service';
import { Alarm } from 'src/app/interfaces/alarms';

@Component({
  selector: 'app-edit-alarme',
  templateUrl: './edit-alarme.page.html',
  styleUrls: ['./edit-alarme.page.scss'],
})
export class EditAlarmePage implements OnInit {
  alarmId: number = 0;
  alarmDetails: Alarm = {} as Alarm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alarmService: AlarmService
  ) {}

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
        this.alarmDetails.id = id; // Assurez-vous que l'ID est correctement assigné
      },
      (error) => {
        console.error('Error fetching alarm details', error);
      }
    );
  }

  saveAlarm() {
    console.log('Form values before saving:', this.alarmDetails); // Affichez les valeurs du formulaire avant d'envoyer
    console.log('Saving Alarm ID:', this.alarmDetails.id); // Affichez l'ID de l'alarme à sauvegarder

    // Utilisez un objet temporaire pour stocker les valeurs du formulaire
    const updatedAlarmDetails: Alarm = {
      id: this.alarmDetails.id,
      calendarId: this.alarmDetails.calendarId,
      name: this.alarmDetails.name,
      ringDate: new Date(this.alarmDetails.ringDate),
      createdAt: this.alarmDetails.createdAt,
      location: this.alarmDetails.location,
      ringtone: this.alarmDetails.ringtone,
      active: this.alarmDetails.active
    };

    console.log('Updated Alarm Details:', updatedAlarmDetails); // Affichez les valeurs mises à jour avant d'envoyer

    this.alarmService.updateAlarmDetails(updatedAlarmDetails).subscribe(
      (data: Alarm) => {
        console.log('Response from API:', data); // Affichez la réponse de l'API
        this.router.navigate(['/alarm-details', this.alarmId]);
      },
      (error) => {
        console.error('Error updating alarm', error);
      }
    );
  }
}