import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlarmService } from 'src/app/services/alarm.service';
import { Alarm, AlarmData } from 'src/app/interfaces/alarms';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-alarm',
  templateUrl: './edit-alarm.page.html',
  styleUrls: ['./edit-alarm.page.scss'], // Assurez-vous que le fichier SCSS est référencé ici
})
export class EditAlarmePage implements OnInit {
  alarmId: number = 0;
  alarmDetails: AlarmData = {} as AlarmData;
  minDate: string = '';

  alarmForm!: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private alarmService: AlarmService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alarmId = +id;
      this.getAlarmDetails(this.alarmId);
    }
    this.minDate = this.getCurrentDate();

    console.log('Test: ', this.alarmDetails);
    this.alarmForm = new FormGroup({
      name: new FormControl(this.alarmDetails.Name, [
        Validators.required, 
        Validators.maxLength(50)
      ]),
      ringDate: new FormControl(this.alarmDetails.RingDate, [
        Validators.required,
        
      ]),
      locationStart: new FormControl(this.alarmDetails.LocationStart, [
        Validators.maxLength(100)
      ]),
      locationEnd: new FormControl(this.alarmDetails.LocationEnd, [
        Validators.maxLength(100)
      ]),
      active: new FormControl(this.alarmDetails.IsActive),
    });
  }

  get name() {
    return this.alarmForm.get('name');
  }

getAlarmDetails(id: number) {
    this.alarmService.getAlarmById(id).subscribe(
      (data: AlarmData) => {
        this.alarmDetails = data;
        this.updateFormValues(data);
        console.log('Alarm details:', this.alarmDetails);
      },
      (error) => {
        console.error('Error fetching alarm details', error);
      }
    );
  }

  updateFormValues(data: any) {
    this.alarmForm.patchValue({
      name: data.Name,
      ringDate: data.RingDate,
      locationStart: data.LocationStart,
      locationEnd: data.LocationEnd,
      active: data.IsActive,
    });
  }


  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Retourne la date au format ISO (YYYY-MM-DD)
  }

  onSubmit() {
    console.log('Form submitted:', this.alarmForm.value);
    // Utilisez un objet temporaire pour stocker les valeurs du formulaire
    const updatedAlarmDetails: AlarmData = {
      Description: '',
      ID: this.alarmDetails.ID,
      CalendarID: this.alarmDetails.CalendarID,
      Name: this.alarmForm.value.name,
      RingDate: this.alarmForm.value.ringDate,
      CreatedAt: String(this.alarmDetails.CreatedAt),
      LocationStart: this.alarmForm.value.locationStart,
      LocationEnd: this.alarmForm.value.locationEnd,
      Ringtone: this.alarmDetails.Ringtone,
      IsActive: this.alarmForm.value.active,
    };

    console.log('Updated alarm details:', updatedAlarmDetails);

    this.alarmService.updateAlarmDetails(updatedAlarmDetails).subscribe(
      (data: AlarmData) => {
        console.log('Response from API:', data); // Affichez la réponse de l'API
        window.location.href = `/alarm-details/${this.alarmId}`; // Redirige et recharge la page
      },
      (error) => {
        console.error('Error updating alarm', error);
      }
    );
  }
}