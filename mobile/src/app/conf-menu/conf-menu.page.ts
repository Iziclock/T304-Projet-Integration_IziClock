import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conf-menu',
  templateUrl: './conf-menu.page.html',
  styleUrls: ['./conf-menu.page.scss'],
})
export class ConfMenuPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  doRefresh(event: any) {
    window.location.reload();

    event.target.complete();
  }

}
