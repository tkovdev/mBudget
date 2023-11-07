import { Component } from '@angular/core';
import { Token} from "../../services/auth.service";

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent {

  constructor() {
    let token = Token.fromUrl(window.location.href);
    if(token == null) return;
    let idToken = Token.parse(token.idToken)
    if(!Token.validate(idToken)) return;
    if (token) {
      sessionStorage.setItem('tokens', JSON.stringify(token));
      sessionStorage.setItem('user', JSON.stringify(idToken));
      window.location.href = '/';
    }
  }
}
