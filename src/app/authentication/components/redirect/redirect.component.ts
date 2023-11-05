import { Component } from '@angular/core';
import {Token} from "../../services/auth.service";

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent {

  constructor() {
    try {
      let url = window.location.href;
      if(url.includes("#")){
        let splitUrl = url.split("#");
        if(splitUrl.length > 1) {
          let token: Token = new Token();
          for(let urlSegment of splitUrl[1].split("&")){
            let urlSegmentToken = urlSegment.split("=");
            if(urlSegmentToken.length > 1){
              if(urlSegmentToken[0] == 'access_token'){
                token.accessToken = urlSegmentToken[1];
              } else if(urlSegmentToken[0] == 'expires_in'){
                token.exp = new Date(Date.now())
                token.exp.setSeconds((parseInt(urlSegmentToken[1])))
              }
            }
          }
          sessionStorage.setItem('tokens', JSON.stringify(token));
          window.location.href = splitUrl[0];
        }
      }
    }catch{

    }
    //@ts-ignore
    // this.afAuth.credential.subscribe((userCredential) => console.log(userCredential?.credential.accessToken))
    // this.afAuth.credential.subscribe((userCredential) => {
    //   let credential: any = null;
    //   //@ts-ignore
    //   if(userCredential) credential = userCredential.credential;
    //   if(credential){
    //     var tokenResult$ = this.afAuth.idTokenResult.subscribe((idTokenResult) => {
    //       //@ts-ignore
    //       let exp = new Date(Date.parse(idTokenResult.expirationTime));
    //       //@ts-ignore
    //       let tokens = {idToken: credential.idToken, accessToken: credential.accessToken, exp: exp};
    //       sessionStorage.setItem('tokens', JSON.stringify(tokens))
    //       tokenResult$.unsubscribe();
    //       location.reload();
    //     })
    //   }
    // })
  }
}
