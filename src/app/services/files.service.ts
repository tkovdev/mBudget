import {Injectable} from '@angular/core';
import {AuthService} from "../authentication/services/auth.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {IFileSearch, IFileSearchDetails} from "../models/driveSchema.model";
import FileResource = gapi.client.drive.FileResource;
import {map, Observable} from "rxjs";

export const DriveConfig = {
  BILL_FILE_NAME: '.bills'
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private authService: AuthService, private http: HttpClient) {}

  get files(): Observable<IFileSearch>{
    return this.listAppDataFiles();
  }

  getFile<T>(id: string): Observable<T | undefined> {
    let query: HttpParams = new HttpParams();
    query = query.append('alt', 'media')
    query = query.append('spaces', 'appDataFolder')

    let uri = `https://www.googleapis.com/drive/v3/files/${id}`
    let fullUri = FileCache.fullUrl(uri, query)

    if(FileCache.isValid(fullUri)) {
      let cachedFile = FileCache.getStoredCache(fullUri);
      return new Observable((subscriber) => subscriber.next(cachedFile!.data as T));
    }

    return this.http.get<any>(uri, {params: query}).pipe(map((res) => {
      FileCache.setStoredCache(fullUri, res);
      if(res) return res as T
      else return undefined;
    }))
  }

  createFile(name: string, content: any, parents: string[] = []): Observable<FileResource> {
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
      return this.http.post<FileResource>(uri, body,{params: query, headers: headers});
  }

  updateFile(id: string, contents: any): Observable<FileResource> {
    let query: HttpParams = new HttpParams();
    query = query.append('uploadType', 'media');

    let body = contents;

    let uri = `https://www.googleapis.com/upload/drive/v3/files/${id}`;
    return this.http.patch<FileResource>(uri, body,{params: query}).pipe(map((res) => {
      let cacheUri = `https://www.googleapis.com/drive/v3/files/${id}`;
      FileCache.resetStoredCache();
      return res;
    }));
  }

  deleteFile(id: string): Observable<boolean> {
    let query: HttpParams = new HttpParams();
    query = query.append('spaces', 'appDataFolder')

    let uri = `https://www.googleapis.com/drive/v3/files/${id}`
    return this.http.delete<any>(uri, {params: query}).pipe(map((res) => {
      FileCache.resetStoredCache();
      if(res) return(false);
      else return(true);
    }));
  }

  listAppDataFiles(): Observable<IFileSearch> {
    let query: HttpParams = new HttpParams();
    query = query.append('spaces', 'appDataFolder')

    let uri = `https://www.googleapis.com/drive/v3/files`
    let fullUri = FileCache.fullUrl(uri, query)
    if(FileCache.isValid(fullUri)) {
      let cachedFile = FileCache.getStoredCache(fullUri);
      return new Observable((subscriber) => subscriber.next(cachedFile!.data as IFileSearch));
    }
    return this.http.get<IFileSearch>(uri, {params: query}).pipe(map((res) => {
      FileCache.setStoredCache(fullUri, res);
      return res;
    }))
  }

  listAppDataFilesDetails(): Observable<IFileSearchDetails> {
    let query: HttpParams = new HttpParams();
    query = query.append('spaces', 'appDataFolder')
    query = query.append('fields', 'files(id,name,kind,size,mimeType,size,createdTime,modifiedTime)')

    let uri = `https://www.googleapis.com/drive/v3/files`
    let fullUri = FileCache.fullUrl(uri, query)
    if(FileCache.isValid(fullUri)) {
      let cachedFile = FileCache.getStoredCache(fullUri);
      return new Observable((subscriber) => subscriber.next(cachedFile!.data as IFileSearch));
    }

    return this.http.get<IFileSearchDetails>(uri, {params: query}).pipe(map((res) => {
      FileCache.setStoredCache(fullUri, res);
      return res;
    }))
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

export class FileCache {
  [key: string]: {time: number, data: any}

  static get cache() {
    let cachedFiles: FileCache = {};
    let initCache = sessionStorage.getItem('cache');
    if(initCache) cachedFiles = JSON.parse(initCache);

    return cachedFiles;
  }

  static getStoredCache(uri: string) {
    let cachedFiles = this.cache;
    if(!cachedFiles[uri]) return undefined;
    return cachedFiles[uri];
  }

  static setStoredCache(uri: string, data: any) {
    let cachedFiles = this.cache;
    cachedFiles[uri] = {time: Date.now(), data: data};
    sessionStorage.setItem('cache', JSON.stringify(cachedFiles));
  }

  static removeStoredCache(uri: string) {
    let cachedFiles = this.cache;
    try {
      delete cachedFiles[uri];
      sessionStorage.setItem('cache', JSON.stringify(cachedFiles));
    }catch{}
  }

  static resetStoredCache() {
    let cachedFiles = this.cache;
    Object.keys(cachedFiles).forEach((v) => {
      delete cachedFiles[v];
    });
    sessionStorage.setItem('cache', JSON.stringify(cachedFiles));
  }

  static isValid(uri: string): boolean {
    let cache = FileCache.getStoredCache(uri);
    if(cache == undefined) return false;

    //if last cache < 10 mins reuse cache
    if (cache.time + 600000 > Date.now()) return true;
    else return false;
  }

  static fullUrl(uri: string, query: HttpParams): string {
    return `${uri}?${query.toString()}`;
  }
}
