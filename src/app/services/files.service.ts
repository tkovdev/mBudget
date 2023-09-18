import { Injectable } from '@angular/core';
import {AuthService} from "../authentication/services/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  listFiles(): Observable<any> {
    let query: HttpParams = new HttpParams();
    let uri = `https://www.googleapis.com/drive/v2/files`;
    return this.http.get<any>(uri, {params: query});
  }

  createFile(): Observable<any> {
    let query: HttpParams = new HttpParams();
    query = query.append('uploadType', 'media');
    let uri = `https://www.googleapis.com/upload/drive/v3/files`;
    return this.http.post<any>(uri, {}, {params: query});
  }
}
