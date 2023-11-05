import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {map, Observable} from "rxjs";
import {DriveConfig} from "../../services/files.service";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

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
      if(!this.accessToken) subscriber.next(false);
      else subscriber.next(true)
    });
  }

  // Returns user profile info
  get userProfile(): Observable<UserProfile | null> {
    return this.http.get<UserProfile>('https://www.googleapis.com/oauth2/v1/userinfo');
  }

  // Sign in with Google
  SignInGoogle() {
    let redirectUri = environment.gapi.redirectUri;
    let clientId = environment.gapi.clientId;
    let scopes = ['openid', 'profile', 'email', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.appdata'];
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes.join(' ')}`;
  }

  // Sign out
  SignOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      sessionStorage.removeItem('tokens');
      sessionStorage.removeItem(DriveConfig.BILL_FILE_NAME);
      resolve();
    })
  }

  get accessToken(): Token | null {
    let tokenString = sessionStorage.getItem('tokens');
    if(!tokenString) return null;
    try{
      return JSON.parse(tokenString) as Token;
    }catch {
      return null
    }
  }
}

export const LoginGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(AuthService).canActivate(next, state);
}

export class UserProfile {
  public email?: string;
  public name?: string;
  public picture?: string;

  // static parseFromAuth = (profile: User | null): UserProfile | null => {
  //   if(profile == null) return null;
  //   let user: UserProfile = new UserProfile();
  //
  //   try{
  //     user.email = profile.email!;
  //     user.displayName = profile.displayName!;
  //     user.photoURL = profile.photoURL? profile.photoURL : '/assets/default-account-icon.svg';
  //     user.lastLoginAt = new Date(profile.metadata.lastSignInTime!);
  //     user.provider = profile.providerData[0]?.providerId;
  //   }catch{
  //     return null;
  //   }
  //   return user;
  // }

  static parseFromString = (profile: string | null): UserProfile => {
    if(profile == null) return new UserProfile();
    let user: UserProfile = new UserProfile();
    let parsed: any;
    try{
      parsed = JSON.parse(profile);
    }catch{
      return user;
    }
    user.email = parsed.email;
    user.name = parsed.name;
    user.picture = parsed.picture? parsed.photoURL : '/assets/default-account-icon.svg';
    return user;
  }
}

export class Token {
  accessToken: string = '';
  exp: Date = new Date(0);
}
