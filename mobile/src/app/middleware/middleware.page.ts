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
    let loggedIn:boolean = false
    const code = this.activeRoute.snapshot.queryParamMap.get("code");
    if (code){
      console.log("code=",code);
      const token = this.authService.retrieveTokenLazy(code.trim())
      if (localStorage.getItem("access_token")!= undefined){
        console.log("trouve ça:",localStorage.getItem("access_token"))
        this.router.navigate(["/calendars"])
      }

    }
    else{
      console.log("not valided")
    }
    /*this.activeRoute.queryParamMap.subscribe(params => {
      const code = params.get("code");
      const state = params.get("state");
      if (code && state) {
        console.log('Code d\'autorisation reçu :', code);
        this.http.get(`${environment.api}/calendars/api?${code}`)
        this.authService.exchangeCodeForToken(code).subscribe(
          (tokenResponse) => {
            console.log('Token d\'accès reçu:', tokenResponse);
            
            localStorage.setItem("access_token",tokenResponse)
            this.router.navigate(['/calendars']);
          },
          (error) => {
            console.error('Erreur lors de l\'échange du code :', error);
          }
        );
      } else {
        console.error('Code ou state manquant');
      }
    })
    //this.checkLoggedIn()
  }
  /*
  checkLoggedIn(){
    const paramValue = this.activeRoute.snapshot.queryParamMap.get("code");
    if (paramValue){
      console.log("checked")
      this.router.navigate(["/calendars"],{state:{code:paramValue}})
    }
    else{
      console.log("not valided")
    }
*/
  }
 

}
