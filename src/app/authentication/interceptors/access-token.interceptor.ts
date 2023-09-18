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
    return this.authService.tokens.pipe(
      first(),
      mergeMap((token: Token) => {
        if(token){
          if(token.exp <= new Date()) {
            this.authService.SignInGoogle();
          }
          request = request.clone({
            setHeaders: {Authorization: `Bearer ${token.accessToken}`}
          });
        }
        return next.handle(request);
      }));
  }
}
