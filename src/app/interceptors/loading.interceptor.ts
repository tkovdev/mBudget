import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {SharedService} from "../services/shared.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private sharedService: SharedService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.sharedService.queueLoading(request.url);
    return next.handle(request).pipe(
      finalize(() => {
        this.sharedService.dequeueLoading(request.url);
      })
    );
  }
}
