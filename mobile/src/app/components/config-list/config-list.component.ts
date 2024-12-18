import { Component} from '@angular/core';
import { ringtone } from 'src/app/classes/ringtones';
import { Ringtone } from 'src/app/interfaces/ringtones';
import { RingtoneService} from 'src/app/services/ringtone.service'
import { UserService } from 'src/app/services/user.service';
import { user } from 'src/app/classes/user';
import { User, UserData } from 'src/app/interfaces/users';
import { AlarmService } from 'src/app/services/alarm.service';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss'],
})
export class ConfigListComponent{
  defaultTime: number = 10; 
  selectedRingtone: Ringtone | undefined; 
  ringtones: Ringtone[] = []; 
  timeError: boolean = false;
  requestState: number = 0;

  constructor(private ringtoneService: RingtoneService, private userService: UserService, private AlarmService: AlarmService) {
    this.ringtoneService.getRingtones().subscribe((data: any) => {
      console.log(data);
      for (let ringtoneData of data) {
        const newRingtone: Ringtone = new ringtone(ringtoneData);
        this.ringtones.push(newRingtone);
      }
    });
    
    this.userService.getUser().subscribe((data: any) => {
      let defaultUserData: UserData = data;
      console.log(defaultUserData)
      let defaultUser: User = new user(defaultUserData);
      console.log(defaultUser);
      this.defaultTime = defaultUser.prepTime;
      this.selectedRingtone = this.ringtones.find(ringtone => ringtone.id === defaultUser.ringtone);
    });
  }

  validateTime() {
    const TIME_MAX = 120; // en minutes
    this.timeError = (this.defaultTime < 0 || this.defaultTime > TIME_MAX);
  }

  saveSettings() {
    if (!this.timeError) {
      this.userService.updateUser({
        PreparationTime: this.defaultTime,
        RingtoneID: this.selectedRingtone?.id
      }).subscribe((data: any) => {
        console.log(data);
      });

      this.AlarmService.setAlarmsByDefault().subscribe((data: any) => {
        console.log("Alarms set by default");
      });

      this.requestState = 1;
    } else {
      console.log('Erreur de temps');
      this.requestState = 2;
    }
  }
}
