import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthService} from "./authentication/services/auth.service";
import {environment} from "../environments/environment";
import {ConfirmationService, MessageService} from "primeng/api";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import {AccessTokenInterceptor} from "./authentication/interceptors/access-token.interceptor";
import {RedirectComponent} from "./authentication/components/redirect/redirect.component";
import {AuthenticationModule} from "./authentication/authentication.module";
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AuthenticationModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),

    ConfirmDialogModule
  ],
  providers: [
    MessageService,
    AuthService,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    { provide: HTTP_INTERCEPTORS, useClass: AccessTokenInterceptor, multi: true },
    ConfirmationService
  ],
  bootstrap: [AppComponent, RedirectComponent]
})
export class AppModule { }
