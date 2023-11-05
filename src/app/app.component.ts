import {Component, OnInit} from '@angular/core';
import {AuthService} from "./authentication/services/auth.service";
import {FilesService} from "./services/files.service";
import {MenuItem} from "primeng/api";
import {Observable} from "rxjs";
import {SharedService} from "./services/shared.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'mBudget-app';

  menu: MenuItem[] = [];
  profileImage: string = 'assets/default-account-icon.svg';
  loading$: Observable<boolean> = this.sharedService.isLoadingEmit;

  constructor(private authService: AuthService, private fileService: FilesService, private sharedService: SharedService) {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      if(loggedIn){
        this.authService.userProfile.subscribe((res) => {
          if(res && res.picture) this.profileImage = res?.picture;
        })
      }
    });
    this.menu = [
      {label: 'Home', routerLink: ['']},
      {label: 'Bills', routerLink: ['', 'bills']},
      {label: 'Payees', routerLink: ['', 'payees']},
    ]
  }
  ngOnInit(): void {
  }
}
