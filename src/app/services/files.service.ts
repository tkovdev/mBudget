import {Injectable} from '@angular/core';
import {AuthService} from "../authentication/services/auth.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {IFileSearch, IFileSearchDetails} from "../models/driveSchema.model";
import FileResource = gapi.client.drive.FileResource;
import {Observable} from "rxjs";

export const DriveConfig = {
  BILL_FILE_NAME: '.bills'
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  constructor(private authService: AuthService, private http: HttpClient) {
  }

  get files(): Observable<IFileSearch>{
    return new Observable<IFileSearch>((subscriber) => {
      this.listAppDataFiles().then((files) => {
        subscriber.next(files);
      })
    });
  }

  getFile<T>(id: string): Promise<T | undefined> {
    let query: HttpParams = new HttpParams();
    query = query.append('alt', 'media')
    query = query.append('spaces', 'appDataFolder')

    let uri = `https://www.googleapis.com/drive/v3/files/${id}`
    return new Promise<T | undefined>((resolve) => {
      this.http.get<any>(uri, {params: query}).subscribe((res: any) => {
        if(res) resolve(res as T);
        else resolve(undefined);
      })
    });
  }

  createFile(name: string, content: any, parents: string[] = []): Promise<FileResource> {
    return new Promise<FileResource>((resolve) => {
      let query: HttpParams = new HttpParams();
      query = query.append('uploadType', 'multipart');
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'multipart/related; boundary="ax100"');
      parents = [...parents, 'appDataFolder'];

      let body = '';
      body = body + '--ax100\n';
      body = body + 'Content-Type: application/json; charset=UTF-8';
      body = body + '\n\n';
      body = body + JSON.stringify({name: name, parents: parents});
      body = body + '\n\n';
      body = body + '--ax100\n';
      body = body + 'Content-Type: application/json';
      body = body + '\n\n';
      body = body + JSON.stringify(content);
      body = body + '\n\n';
      body = body + '--ax100--';

      let uri = `https://www.googleapis.com/upload/drive/v3/files`;
      this.http.post<FileResource>(uri, body,{params: query, headers: headers}).subscribe((res) => {
        resolve(res);
      });
    });
  }

  updateFile(id: string, contents: any): Promise<FileResource> {
    return new Promise<any>((resolve) => {
      let query: HttpParams = new HttpParams();
      query = query.append('uploadType', 'media');

      let body = contents;

      let uri = `https://www.googleapis.com/upload/drive/v3/files/${id}`;
      this.http.patch<FileResource>(uri, body,{params: query}).subscribe((res) => {
        resolve(res);
      });
    });
  }

  deleteFile(id: string): Promise<boolean> {
    let query: HttpParams = new HttpParams();
    query = query.append('spaces', 'appDataFolder')

    let uri = `https://www.googleapis.com/drive/v3/files/${id}`
    return new Promise<boolean>((resolve) => {
      this.http.delete<any>(uri, {params: query}).subscribe((res: any) => {
        if(res) resolve(false);
        else resolve(true);
      })
    });
  }

  listAppDataFiles(): Promise<IFileSearch> {
    let query: HttpParams = new HttpParams();
    query = query.append('spaces', 'appDataFolder')

    let uri = `https://www.googleapis.com/drive/v3/files`
    return new Promise<IFileSearch>((resolve) => {
      this.http.get<IFileSearch>(uri, {params: query}).subscribe((res: any) => {
        resolve(res);
      })
    });
  }

  listAppDataFilesDetails(): Observable<IFileSearchDetails> {
    let query: HttpParams = new HttpParams();
    query = query.append('spaces', 'appDataFolder')
    query = query.append('fields', 'files(id,name,kind,mimeType,size,createdTime,modifiedTime)')

    let uri = `https://www.googleapis.com/drive/v3/files`
    return this.http.get<IFileSearchDetails>(uri, {params: query})
  }

  private findFolder(name: string): Promise<FileResource | undefined> {
    return new Promise<FileResource | undefined>((resolver) => {
      let query: HttpParams = new HttpParams();
      let search = "mimeType='application/vnd.google-apps.folder'"
      search = search + " and "
      search = search + `name='${name}'`
      query = query.append('q', search)
      query = query.append('spaces', 'appDataFolder')
      let uri = `https://www.googleapis.com/drive/v3/files`;
      this.http.get<IFileSearch>(uri,{params: query}).subscribe((res) => {
        if(res && res.files.length > 0){
          resolver(res.files[0]);
        }else resolver(undefined);
      })
    });
  }

  private createFolder(name: string, parents: string[] = []): Promise<FileResource> {
    let query: HttpParams = new HttpParams();
    let schema = {
      name: name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [...parents, 'appDataFolder']
    }
    let uri = `https://www.googleapis.com/drive/v3/files`;
    return new Promise<FileResource>((resolve) => {
      this.http.post<FileResource>(uri, schema, {params: query}).subscribe((newFolder) => {
        resolve(newFolder);
      });
    });
  }

  private findFile(name: string): Promise<FileResource | undefined> {
    return new Promise<FileResource | undefined>((resolver) => {
      let query: HttpParams = new HttpParams();
      let search = "mimeType='application/json'"
      search = search + " and "
      search = search + `name='${name}'`
      query = query.append('q', search)
      query = query.append('spaces', 'appDataFolder')
      let uri = `https://www.googleapis.com/drive/v3/files`;
      this.http.get<IFileSearch>(uri,{params: query}).subscribe((res) => {
        if(res && res.files.length > 0){
          resolver(res.files[0]);
        }else resolver(undefined);
      })
    });
  }
}
