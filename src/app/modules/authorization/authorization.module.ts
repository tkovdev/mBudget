import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import {AuthorizationRoutingModule} from "./authorization-routing.module";
import {CardModule} from "primeng/card";
import { ProfileComponent } from './pages/profile/profile.component';
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,

    CardModule,
    ButtonModule
  ]
})
export class AuthorizationModule { }
