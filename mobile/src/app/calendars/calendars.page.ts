import { Component, OnInit,OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendars',
  templateUrl: './calendars.page.html',
  styleUrls: ['./calendars.page.scss'],
})
export class CalendarsPage implements OnInit {
  constructor(private router: Router) {}
  loggedIn:boolean=false

  ngOnInit() {
    console.log(localStorage.getItem("access_token"))
    if(localStorage.getItem("access_token")){
      this.loggedIn = true
      console.log("acces accordé:",this.loggedIn)
    }
    else{
      this.loggedIn=false
    }
  }
  
}
