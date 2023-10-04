import { Component } from '@angular/core';
import {Token} from "../../services/auth.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent {

  constructor(private afAuth: AngularFireAuth) {
    //@ts-ignore
    // this.afAuth.credential.subscribe((userCredential) => console.log(userCredential?.credential.accessToken))
    this.afAuth.credential.subscribe((userCredential) => {
      let credential: any = null;
      //@ts-ignore
      if(userCredential) credential = userCredential.credential;
      if(credential){
        var tokenResult$ = this.afAuth.idTokenResult.subscribe((idTokenResult) => {
          //@ts-ignore
          let exp = new Date(Date.parse(idTokenResult.expirationTime));
          //@ts-ignore
          let tokens = {idToken: credential.idToken, accessToken: credential.accessToken, exp: exp};
          sessionStorage.setItem('tokens', JSON.stringify(tokens))
          tokenResult$.unsubscribe();
          location.reload();
        })
      }
    })
  }
}
