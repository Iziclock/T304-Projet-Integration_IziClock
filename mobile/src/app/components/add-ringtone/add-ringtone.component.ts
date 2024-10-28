import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-ringtone',
  templateUrl: './add-ringtone.component.html',
  styleUrls: ['./add-ringtone.component.scss'],
})
export class AddRingtoneComponent  implements OnInit {

  constructor() { }

  uploadRingtone() {
    console.log('upload ringtone');
  }

  ngOnInit() {}

}