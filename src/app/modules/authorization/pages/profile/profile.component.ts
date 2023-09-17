import {Component, OnInit} from '@angular/core';
import {AuthService, UserProfile} from "../../../../authentication/services/auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  user$: Observable<UserProfile | null> = new Observable<UserProfile | null>();

  constructor(private authService: AuthService, private router: Router) {
  }
  ngOnInit(): void {
    this.user$ = this.authService.userProfile;
  }

  signOut(): void {
    this.authService.SignOut().then(() => {
      this.router.navigate([''])
    });
  }
}
