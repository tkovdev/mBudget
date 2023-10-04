import {inject, Injectable, NgZone} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import {MessageService} from "primeng/api";
import {GoogleAuthProvider, idToken} from "@angular/fire/auth";
import User = firebase.User;
import {map, Observable, take} from "rxjs";
import UserCredential = firebase.auth.UserCredential;
import {DriveConfig} from "../../services/files.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly _provider = new GoogleAuthProvider();

  constructor(
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private router: Router,
    private ngZone: NgZone,
    private messageService: MessageService,
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

  // Returns true when user is logged in and email is verified
  get isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.afAuth.authState.subscribe((user) => {
        if(user != null){
          let currentSessionTokens = sessionStorage.getItem('tokens')
          if(currentSessionTokens) subscriber.next(true);
          else subscriber.next(false);
        }else subscriber.next(false);
      });
    });
  }

  // Returns user profile info
  get userProfile(): Observable<UserProfile | null> {
    return this.afAuth.user.pipe(
      map(user => UserProfile.parseFromAuth(user)))
  }

  get tokens(): Observable<Token> {
    return new Observable<Token>((subscriber) => {
      let tokens = sessionStorage.getItem('tokens');
      if(tokens){
        subscriber.next(JSON.parse(tokens) as Token);
      }
    })
  }

  // Sign in with Google
  SignInGoogle() {
    this._provider.addScope('https://www.googleapis.com/auth/drive.file');
    this._provider.addScope('https://www.googleapis.com/auth/drive.appdata');
    return this.afAuth.signInWithRedirect(this._provider);
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      sessionStorage.removeItem('tokens');
      sessionStorage.removeItem(DriveConfig.BILL_FILE_NAME);
      this.messageService.add({key: 'global', severity: 'success', summary: 'Sign Out Successful', detail: 'You have been signed out.'})
    });
  }
}

export const LoginGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(AuthService).canActivate(next, state);
}

export class UserProfile {
  public lastLoginAt?: Date;
  public email?: string;
  public displayName?: string;
  public photoURL?: string;
  public provider?: string;

  static parseFromAuth = (profile: User | null): UserProfile | null => {
    if(profile == null) return null;
    let user: UserProfile = new UserProfile();

    try{
      user.email = profile.email!;
      user.displayName = profile.displayName!;
      user.photoURL = profile.photoURL? profile.photoURL : '/assets/default-account-icon.svg';
      user.lastLoginAt = new Date(profile.metadata.lastSignInTime!);
      user.provider = profile.providerData[0]?.providerId;
    }catch{
      return null;
    }
    return user;
  }

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
    user.displayName = parsed.displayName;
    user.photoURL = parsed.photoURL? parsed.photoURL : '/assets/default-account-icon.svg';
    try{
      user.lastLoginAt = new Date(Number.parseInt(parsed.lastLoginAt));
    }catch{}
    try{
      user.provider = parsed.providerData[0]?.providerId;
    }catch{}
    return user;
  }
}

export class Token {
  idToken: string = '';
  accessToken: string = '';
  exp: Date = new Date(0);
}
