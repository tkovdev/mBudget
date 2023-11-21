import {Component, OnInit} from '@angular/core';
import {AuthService} from "./authentication/services/auth.service";
import {DriveConfig, FilesService} from "./services/files.service";
import {ConfirmationService, ConfirmEventType, MenuItem} from "primeng/api";
import {Observable} from "rxjs";
import {SharedService} from "./services/shared.service";
import {IBillSchema} from "./models/driveSchema.model";

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

  constructor(private authService: AuthService, private fileService: FilesService, private sharedService: SharedService, private confirmationService: ConfirmationService) {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      if(loggedIn){
        this.authService.userProfile.subscribe((res) => {
          if(res && res.picture) this.profileImage = res?.picture;
        })
      }
    });
    this.menu = [
      {label: 'Bills', routerLink: ['', 'bills']},
      {label: 'Payees', routerLink: ['', 'payees']},
    ]
  }
  ngOnInit(): void {
  }

  get canRefreshCache(): boolean {
    let billFileId = sessionStorage.getItem(DriveConfig.BILL_FILE_NAME);
    if(!billFileId) return false;
    let billFile = sessionStorage.getItem(billFileId);
    if(!billFile) return false;

    return true;
  }

  refreshCache(): void {
    this.confirmRefreshCache();
  }

  private confirmRefreshCache(): void {
    this.confirmationService.confirm({
      message: 'Would you like to refresh your file cache? This requires an internet connection and will destroy any unsaved work.',
      header: 'Refresh File Cache?',
      icon: 'pi pi-exclamation-triangle',
      key: 'refreshCacheConfirmation',
      accept: () => {
        let billFileId = sessionStorage.getItem(DriveConfig.BILL_FILE_NAME);
        if(!billFileId) return;
        sessionStorage.removeItem(billFileId);
        location.reload();
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      }
    });
  }
}
