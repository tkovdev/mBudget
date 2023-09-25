import {Injectable} from '@angular/core';
import {AuthService} from "../authentication/services/auth.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {IBillSchema, IDriveSchema, IFileSearch, SchemaType} from "../models/driveSchema.model";
import FileResource = gapi.client.drive.FileResource;

export const DriveConfig = {
  SCHEMA_FILE_NAME: '.schema',
  BILLS_FILE_NAME: '.bills',
}
@Injectable({
  providedIn: 'root'
})
export class FilesService {


  constructor(private authService: AuthService, private http: HttpClient) { }

  retrieveSessionFile<T>(name: string): T | undefined {
    let temp = sessionStorage.getItem(name);
    if(temp){
      try{
        let file: T = JSON.parse(temp);
        return file;
      }catch{
        throw new Error(`File: ${name} not loaded!`)
      }
    }
    return undefined;
  }

  private storeSessionFile<T>(name: string, contents: T): void {
      try{
        let temp: string = JSON.stringify(contents);
        sessionStorage.setItem(name, temp);
      }catch{
        throw new Error('Error storing file in session')
      }
  }

  loadFiles(schemaType: SchemaType): Promise<void> {
    return new Promise<void>((resolve) => {
      let filesToLoad = this.retrieveSessionFile<IDriveSchema>(DriveConfig.SCHEMA_FILE_NAME);
      if(!filesToLoad) {
        throw new Error('Schema not loaded! Load schema first!');
        resolve();
      }
      filesToLoad.schemaIds.filter(x => x.type == schemaType).forEach((fileToLoad) => {
        if(fileToLoad.type == SchemaType.Bill){
          this.getFile<IBillSchema>(fileToLoad.id).then((file) => {
            this.storeSessionFile(fileToLoad.id, file);
          });
        }else if(fileToLoad.type == SchemaType.Budget){
          // this.getFile<IBudgetSchema>(fileToLoad.id).then((file) => {
          //   this.storeSessionFile(fileToLoad.id, file);
          // });
        }
      });
    })
  }

  loadSchema(): Promise<IDriveSchema> {
    return new Promise<IDriveSchema>((resolve) => {
      this.findFile(DriveConfig.SCHEMA_FILE_NAME).then((file) => {
        if(file){
          this.getFile<IDriveSchema>(file.id).then((schema) => {
            if(schema) {
              this.storeSessionFile(DriveConfig.SCHEMA_FILE_NAME, schema);
              resolve(schema);
            }
            else throw new Error('Unable to obtain schema file!');
          });
        }else{
          let billContent: IBillSchema = {payees: [], bills: []};
          this.createFile(DriveConfig.BILLS_FILE_NAME, billContent).then((billFile) => {
            let newSchema: IDriveSchema = {
              name: 'My Finances',
              schemaIds: [
                {id: billFile.id, type: SchemaType.Bill}
              ],
              date: new Date()
            };
            this.createFile(DriveConfig.SCHEMA_FILE_NAME, newSchema).then((file) => {
              this.getFile<IDriveSchema>(file.id).then((schema) => {
                if(schema) {
                  this.storeSessionFile(DriveConfig.SCHEMA_FILE_NAME, schema);
                  resolve(schema);
                }
                else throw new Error('Unable to obtain schema file!');
              })
            });
          });
        }
      })
    })
  }

  findFile(name: string): Promise<FileResource | undefined> {
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

  updateFile(id: string, contents: any): Promise<any> {
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


}
