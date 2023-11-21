import {NgModule, isDevMode} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthService} from "./authentication/services/auth.service";
import {environment} from "../environments/environment";
import {ConfirmationService, MessageService} from "primeng/api";
import {AccessTokenInterceptor} from "./authentication/interceptors/access-token.interceptor";
import {RedirectComponent} from "./authentication/components/redirect/redirect.component";
import {AuthenticationModule} from "./authentication/authentication.module";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {MenubarModule} from "primeng/menubar";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {LoadingInterceptor} from "./interceptors/loading.interceptor";
import {BillGuard} from "./services/bills.service";
import {FileGuard} from "./services/files.service";
import { ServiceWorkerModule } from '@angular/service-worker';
import {NgOptimizedImage} from "@angular/common";

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

    ConfirmDialogModule,
    MenubarModule,
    ProgressSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgOptimizedImage
  ],
  providers: [
    MessageService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AccessTokenInterceptor,
      multi: true
    },
    ConfirmationService
  ],
  bootstrap: [AppComponent, RedirectComponent]
})
export class AppModule { }
