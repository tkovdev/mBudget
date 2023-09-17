import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {first, mergeMap} from "rxjs/operators";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private afAuth: AngularFireAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if account is logged in and request is to the api url
    return this.afAuth.idToken.pipe(
      first(),
      mergeMap((token: string | null) => {
        if(token){
          request = request.clone({
            setHeaders: {Authorization: `Bearer ${token}`}
          });
        }
        return next.handle(request);
    }));
  }
}
