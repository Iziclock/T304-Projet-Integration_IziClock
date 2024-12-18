import { Component} from '@angular/core';
import { ringtone } from 'src/app/classes/ringtones';
import { Ringtone } from 'src/app/interfaces/ringtones';
import { RingtoneService} from 'src/app/services/ringtone.service'
import { UserService } from 'src/app/services/user.service';
import { user } from 'src/app/classes/user';
import { User, UserData } from 'src/app/interfaces/users';

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

  constructor(private ringtoneService: RingtoneService, private userService: UserService) {
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
    this.timeError = this.defaultTime < 0;
  }

  saveSettings() {
    if (!this.timeError) {
      this.userService.updateUser({
        PreparationTime: this.defaultTime,
        RingtoneID: this.selectedRingtone?.id
      }).subscribe((data: any) => {
        window.location.reload();
        console.log(data);
      });
    } else {
      console.log('Erreur de temps');
    }
  }
}
