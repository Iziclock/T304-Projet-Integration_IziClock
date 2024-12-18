import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { isPlatform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private clientId = '"225023011540-dt7tsd29djafhnfd3p84k3rk4dlja0pi.apps.googleusercontent.com"';
  //private clientSecret = "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";
  //private redirectUri = 'http://localhost:8100/middleware';
  user:any;
  constructor(private http: HttpClient,private platform: Platform) {
    if(!isPlatform('capacitor')){
      this.initializeApp();
    }
    this.initializeApp();
  }

  async googleSignIn() {
    this.user = await GoogleAuth.signIn();
    return await this.user;
  }
  

  retrieveTokenLazy(code:string){
    this.http.get(`${environment.api}/calendars/api?code=${code}`,{ responseType: 'json' }).subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response);
        localStorage.setItem("access_token",JSON.stringify(response));
      

      },
      error: (err) => {
        console.error('Erreur:', err);
      }
    })

  }

  initializeApp() {
    this.platform.ready().then(() => {
      GoogleAuth.initialize()
    })
  }

  /*exchangeCodeForToken(code: string): Observable<any> {
    const token={"web":{"client_id":"225023011540-dt7tsd29djafhnfd3p84k3rk4dlja0pi.apps.googleusercontent.com","project_id":"iziclock-438816","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["http://localhost:8100/middleware"]}};
    const body = {
      client_id: token.web.client_id,
      //client_secret: token.web.client_secret,
      code: code,
      include_granted_scopes: 'true',
      state: 'pass-through value',
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      response_type: "token",
      redirect_uri: token.web.redirect_uris,
      grant_type: 'authorization_code',
    };
    

    //return this.http.post('https://oauth2.googleapis.com/token', JSON.stringify(body));
  }*/
}