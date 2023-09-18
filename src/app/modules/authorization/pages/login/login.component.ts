import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../authentication/services/auth.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FilesService} from "../../../../services/files.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private fileService: FilesService) { }

  ngOnInit(): void {
    this.fileService.listFiles().subscribe((res) => {
      console.log(res)
    })
  }

  signIn(): void {
    this.authService.SignInGoogle();
  }

  signOut(): void {
    this.authService.SignOut();
  }
}
