import {inject, Injectable, NgZone} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import {MessageService} from "primeng/api";
import {GoogleAuthProvider} from "@angular/fire/auth";
import User = firebase.User;
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private router: Router,
    private ngZone: NgZone,
    private messageService: MessageService,
  ) {  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isLoggedIn.pipe(map(loggedIn => {
      if(loggedIn) return true;
      else{
        this.router.navigate(['', 'auth', 'login'], {skipLocationChange: true});
        return false;
      }
    }))
  }

  // Returns true when user is logged in and email is verified
  get isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => user != null))
  }

  // Returns user profile info
  get userProfile(): Observable<UserProfile | null> {
    return this.afAuth.user.pipe(
      map(user => UserProfile.parseFromAuth(user)))
  }

  // Sign in with Google
  SignInGoogle() {
    const provider = new GoogleAuthProvider();
    return this.afAuth.signInWithRedirect(provider);
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
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
