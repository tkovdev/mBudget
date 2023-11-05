import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {first, mergeMap} from "rxjs/operators";
import {AuthService, Token} from "../services/auth.service";

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!request.url.includes('https://www.googleapis.com/')) return next.handle(request);
    // add auth header with access token if account is logged in and request is to the api url
    let token = this.authService.accessToken
    if(token && new Date(token!.exp) >= new Date()){
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token.accessToken}`}
      });
    }else{
        this.authService.SignInGoogle();
    }
    return next.handle(request);
  }
}
