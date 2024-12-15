import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-middleware',
  templateUrl: './middleware.page.html',
  styleUrls: ['./middleware.page.scss'],
})
export class MiddlewarePage implements OnInit {

  constructor(private http:HttpClient,private router:Router,private activeRoute: ActivatedRoute,private authService:AuthService) { }

  ngOnInit() {
    /*let loggedIn:boolean = false
    const code = this.activeRoute.snapshot.queryParamMap.get("code");
    if (code){
      console.log("code=",code);
      const token = this.authService.retrieveTokenLazy(code.trim());
      this.router.navigate(["/calendars"]);
      

    }
    else{
      console.log("not valided")
    }*/
  }

}
