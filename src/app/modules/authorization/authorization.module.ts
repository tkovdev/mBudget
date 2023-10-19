import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import {AuthorizationRoutingModule} from "./authorization-routing.module";
import {CardModule} from "primeng/card";
import { ProfileComponent } from './pages/profile/profile.component';
import {ButtonModule} from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {FormsModule} from "@angular/forms";
import { ProfileAdvancedOptionsComponent } from './components/profile-advanced-options/profile-advanced-options.component';
import {DialogService, DynamicDialogModule} from "primeng/dynamicdialog";


@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    ProfileAdvancedOptionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthorizationRoutingModule,

    CardModule,
    ButtonModule,
    DialogModule,
    InputTextareaModule,
    DynamicDialogModule
  ],
  providers: [DialogService]
})
export class AuthorizationModule { }
