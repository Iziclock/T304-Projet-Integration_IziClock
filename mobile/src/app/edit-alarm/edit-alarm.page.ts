import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlarmService } from 'src/app/services/alarm.service';
import { Alarm } from 'src/app/interfaces/alarms';

@Component({
  selector: 'app-edit-alarm',
  templateUrl: './edit-alarm.page.html',
  styleUrls: ['./edit-alarm.page.scss'], // Assurez-vous que le fichier SCSS est référencé ici
})
export class EditAlarmePage implements OnInit {
  alarmId: number = 0;
  alarmDetails: Alarm = {} as Alarm;
  minDate: string = '';
  
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
    this.minDate = this.getCurrentDate();
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

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Retourne la date au format ISO (YYYY-MM-DD)
  }

  saveAlarm() {

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


    this.alarmService.updateAlarmDetails(updatedAlarmDetails).subscribe(
      (data: Alarm) => {
        console.log('Response from API:', data); // Affichez la réponse de l'API
        window.location.href = `/alarm-details/${this.alarmId}`; // Redirige et recharge la page
      },
      (error) => {
        console.error('Error updating alarm', error);
      }
    );
  }
}