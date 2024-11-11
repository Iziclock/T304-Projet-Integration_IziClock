import { Component, OnInit } from '@angular/core';
import { LoginGoogleService } from 'src/app/services/login-google.service';
@Component({
  selector: 'app-login-google',
  templateUrl: './login-google.component.html',
  styleUrls: ['./login-google.component.scss'],
})
export class LoginGoogleComponent  implements OnInit {

  constructor(private loginGoogleService: LoginGoogleService) { }

  getLoginGoogle(){
    console.log("clicked")
    this.loginGoogleService.getLogin().subscribe((data: any) => {
      console.log(data);
      window.location.href = data
      return data
    });
    

  }

  ngOnInit() {
    //let link = this.getLoginGoogle()
    //console.log(link)
  }
}
