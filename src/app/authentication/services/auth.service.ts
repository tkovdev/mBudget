import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {map, Observable} from "rxjs";
import {DriveConfig} from "../../services/files.service";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isLoggedIn.pipe(map(loggedIn => {
      if(loggedIn) return true;
      else{
        this.router.navigate(['', 'auth', 'login'], {skipLocationChange: true});
        return false;
      }
    }));
  }

  // Returns true when user is logged in
  get isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      if(!this.tokens) subscriber.next(false);
      else subscriber.next(true)
    });
  }

  // Sign in with Google
  SignInGoogle() {
    //resets nonce
    this.nonce = null;
    let redirectUri = environment.gapi.redirectUri;
    let clientId = environment.gapi.clientId;
    let nonce = this.nonce;
    let scopes = ['openid', 'profile', 'email', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.appdata'];
    //using this gets the id_token & access_token at same time. Need to generate nonce & check it on redirect for sec purposes
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token id_token&nonce=${nonce}&scope=${scopes.join(' ')}`;
  }

  // Sign out
  SignOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      sessionStorage.removeItem('tokens');
      sessionStorage.removeItem('nonce');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem(DriveConfig.BILL_FILE_NAME);
      resolve();
    })
  }

  set nonce(nonce: string | null) {
    if(nonce == null) sessionStorage.removeItem('nonce');
    else sessionStorage.setItem('nonce', nonce);
  }

  get nonce(): string | null{
    let nonce = sessionStorage.getItem('nonce');
    if(nonce == null) {
      nonce = this.generateNonce();
      sessionStorage.setItem('nonce', nonce);
    }
    try{
      return nonce;
    }catch {
      return null;
    }
  }

  generateNonce(): string {
    return `${Math.random().toFixed(9).replace('0.','')}-${Math.random().toFixed(8).replace('0.','')}-${Math.random().toFixed(10).replace('0.','')}`;
  }

  get tokens(): Token | null {
    let tokenString = sessionStorage.getItem('tokens');
    if(tokenString == null) return null;
    try{
      return JSON.parse(tokenString) as Token;
    }catch {
      return null
    }
  }

  get tokenClaims(): any | null {
    try {
      return Token.parse(this.tokens!.idToken);
    }catch{
      return null;
    }
  }

  get userProfile(): Observable<UserProfile | null> {
    return new Observable((subscriber) => {
      subscriber.next(UserProfile.fromToken(this.tokenClaims));
    })
  }
}

export const LoginGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(AuthService).canActivate(next, state);
}

export class UserProfile {
  public email?: string;
  public name?: string;
  public picture?: string;

  static fromToken = (jwt: any | null): UserProfile | null => {
    if(jwt == null) return null;
    let user: UserProfile = new UserProfile();

    user.email = jwt.email;
    user.name = jwt.name;
    user.picture = jwt.picture? jwt.picture : '/assets/default-account-icon.svg';
    return user;
  }
}

export class Token {
  idToken: string = '';
  accessToken: string = '';
  exp: Date = new Date(0);

  static parse(idToken: string | null): any {
    if(idToken == null) return null;
    try {
      return jwtDecode(idToken);
    }catch{
      return null;
    }
  }

  static validate(parsedToken: any): boolean {
    let nonce = sessionStorage.getItem('nonce');
    if(nonce == null) return false;

    if(parsedToken == null) return false;
    if(nonce == parsedToken.nonce) return true;
    return false;
  }

  static fromUrl(url: string): Token | null {
    try {
      if(url.includes("#")){
        let token: Token = new Token();
        let splitUrl = url.split("#");
        if(splitUrl.length > 1) {
          for(let urlSegment of splitUrl[1].split("&")){
            let urlSegmentToken = urlSegment.split("=");
            if(urlSegmentToken.length > 1){
              if(urlSegmentToken[0] == 'access_token'){
                token.accessToken = urlSegmentToken[1];
              } else if(urlSegmentToken[0] == 'expires_in'){
                token.exp = new Date(Date.now())
                token.exp.setSeconds((parseInt(urlSegmentToken[1])))
              }
              else if(urlSegmentToken[0] == 'id_token') {
                token.idToken = urlSegmentToken[1];
              }
            }
          }
        }
        return token;
      } return null;
    }catch{
      throw new Error('Auth Token Parse failed! User login unsuccessful.')
    }
  }
}
