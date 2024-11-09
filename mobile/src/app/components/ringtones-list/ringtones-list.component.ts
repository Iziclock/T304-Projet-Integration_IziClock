import { Component, OnInit } from '@angular/core';
import { ringtone } from 'src/app/classes/ringtones';
import { Ringtone } from 'src/app/interfaces/ringtones';
import { RingtoneService } from 'src/app/services/ringtone.service';

@Component({
  selector: 'app-ringtones-list',
  templateUrl: './ringtones-list.component.html',
  styleUrls: ['./ringtones-list.component.scss'],
})
export class RingtonesListComponent  implements OnInit {
  ringtones: Ringtone[] = [];

  constructor(private ringtoneService: RingtoneService) { }

  getRingtones() {
    this.ringtoneService.getRingtones().subscribe((data: any) => {
      for (let ringtoneData of data) {
        const newRingtone: Ringtone = new ringtone(ringtoneData);
        this.ringtones.push(newRingtone);
      }
    });
  }

  ngOnInit() {
    this.getRingtones();
  }

}
