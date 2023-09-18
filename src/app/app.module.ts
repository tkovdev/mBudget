import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthService} from "./authentication/services/auth.service";
import {environment} from "../environments/environment";
import {MessageService} from "primeng/api";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import {AccessTokenInterceptor} from "./authentication/interceptors/access-token.interceptor";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  providers: [
    MessageService,
    AuthService,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    { provide: HTTP_INTERCEPTORS, useClass: AccessTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
