import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ringtones',
  templateUrl: './ringtones.page.html',
  styleUrls: ['./ringtones.page.scss'],
})
export class RingtonesPage implements OnInit {

  constructor() { }

  doRefresh(event: any) {
    window.location.reload();

    event.target.complete();
  }

  ngOnInit() {}

}