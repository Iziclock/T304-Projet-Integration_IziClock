import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-alarm-details',
  templateUrl: './alarm-details.page.html',
  styleUrls: ['./alarm-details.page.scss'],
})
export class AlarmDetailsPage implements OnInit {
  alarmId: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alarmId = +id;
    }
  }
}