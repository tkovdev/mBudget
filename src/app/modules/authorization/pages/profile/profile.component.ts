import {Component, OnInit} from '@angular/core';
import {AuthService, UserProfile} from "../../../../authentication/services/auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {FilesService} from "../../../../services/files.service";
import {IBillSchema, IFileSearch, IFileSearchDetails} from "../../../../models/driveSchema.model";
import {DialogService} from "primeng/dynamicdialog";
import {
  ProfileAdvancedOptionsComponent
} from "../../components/profile-advanced-options/profile-advanced-options.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  user$: Observable<UserProfile | null> = new Observable<UserProfile | null>();
  storedFiles$: Observable<IFileSearchDetails> = new Observable<IFileSearchDetails>();

  showFileContent: boolean = false;
  fileContent: string | undefined;
  constructor(private authService: AuthService, private fileService: FilesService, private router: Router, private dialogService: DialogService) {
  }
  ngOnInit(): void {
    this.user$ = this.authService.userProfile;
    this.storedFiles$ = this.fileService.listAppDataFilesDetails();
  }

  signOut(): void {
    this.authService.SignOut().then(() => {
      location.reload();
    });
  }

  viewFile(id: string): void {
    this.fileService.getFile<IBillSchema>(id).then((file) => {
      this.showFileContent = true;
      this.fileContent = JSON.stringify(file);
    })
  }

  deleteFile(id: string): void {
    this.fileService.deleteFile(id).then((res) => {
      location.reload();
    });
  }

  viewAdvancedOptions(id: string): void {
    this.fileService.getFile<IBillSchema>(id).then((file) => {
      ;
      this.dialogService.open(ProfileAdvancedOptionsComponent, {
        header: 'Advanced Options',
        width: '80%',
        height: '80%',
        data: {fileContent: JSON.stringify(file), fileId: id}
      })
    })
  }
}
