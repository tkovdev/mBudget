import {Component, OnInit} from '@angular/core';
import {AuthService} from "./authentication/services/auth.service";
import {FilesService} from "./services/files.service";
import {SchemaType} from "./models/driveSchema.model";
import {IBill, IPayee} from "./models/bill.model";
import {Month} from "./models/shared.model";
import {MenuItem} from "primeng/api";
import {AngularFireAuth} from "@angular/fire/compat/auth";
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

  constructor(private authService: AuthService, private fileService: FilesService, private afAuth: AngularFireAuth, private sharedService: SharedService) {
    this.afAuth.user.subscribe((res) => {
      if(res && res.photoURL) this.profileImage = res?.photoURL;
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
