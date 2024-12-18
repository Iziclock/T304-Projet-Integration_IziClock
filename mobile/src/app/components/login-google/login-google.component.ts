import { Component, OnInit } from '@angular/core';
import { LoginGoogleService } from 'src/app/services/login-google.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CalendarService } from 'src/app/services/calendar.service';
@Component({
  selector: 'app-login-google',
  templateUrl: './login-google.component.html',
  styleUrls: ['./login-google.component.scss'],
})
export class LoginGoogleComponent  implements OnInit {
  user:any;
  constructor(private calendars:CalendarService,private authService:AuthService,private router:Router,private http:HttpClient,) { }

  /*getLoginGoogle(){
    console.log("clicked")
    this.loginGoogleService.getLogin().subscribe((data: any) => {
      console.log(data);
      window.location.href = data
      return data
    });
    

  }*/
  async signIn(){
    this.user = await this.authService.googleSignIn();
    console.log(this.user)
    

    if(this.user){
      localStorage.setItem("access_token",this.user.authentication.accessToken);

     this.calendars.postToken(this.user.authentication.accessToken).subscribe({
        next: (response) => {
        console.log('Réponse du serveur:', response);
        },
        error: (err) => {
          console.error('Erreur:', err);
        }
      })
      this.calendars.getCalendarsAPI().subscribe({
        next: () => {
          window.location.reload();
        },
        error: (err) => {
          console.error(`Error API calendars:`, err);
        }
      });
      this.router.navigate(['/home'])
    }
  }

  ngOnInit() {
    
  }
}
