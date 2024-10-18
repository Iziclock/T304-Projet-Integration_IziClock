import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { calendar } from 'src/app/classes/calendars';
import { Calendar } from 'src/app/interfaces/calendars';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-calendars-management',
  templateUrl: './calendars-management.component.html',
  styleUrls: ['./calendars-management.component.scss'],
})
export class CalendarsManagementComponent  implements OnInit {
  calendars: Calendar[] = [];

  constructor(private calendarService: CalendarService, private alertController: AlertController) {

  }
  
  setCalendars(){
    this.calendarService.getCalendars().subscribe((data: any) => {
      console.log(data);
      for (let calendarData of data) {
        let newCalendar: Calendar = new calendar(calendarData);
        this.calendars.push(newCalendar);
      }
      console.log(this.calendars);
    });
  }

  async deleteAlert(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir supprimer ce calendrier ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'Cancel'
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.calendars = this.calendars.filter(calendar => calendar.id !== id);

            this.calendarService.deleteCalendar(id).subscribe({
              error: (err) => {
                console.error(`Error deleting calendar with ID ${id}:`, err);
              }
            });
          }
        }
      ]
    });
    
    await alert.present();
  }

  deleteCalendar(id: number) {
    this.deleteAlert(id);
  }

  changeIsActiveState(id: number) {
    this.calendarService.changeIsActiveState(id).subscribe({
      next: () => {
        window.location.reload(); // Recharge la page pour mettre à jour les données affichées
      },
      error: (err) => {
        console.error(`Error changing state of calendar with ID ${id}:`, err);
      }
    });
  }

  ngOnInit() {
    this.setCalendars();
  }

}
