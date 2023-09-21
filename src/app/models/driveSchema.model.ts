import {IBill} from "./bill.model";
import FileResource = gapi.client.drive.FileResource;

export interface IDriveSchema {
  name: string;
  date: Date;
  schemaIds: [{
    id: string;
    type: SchemaType
  }]
}

export enum SchemaType {
  Bill = 'Bill',
  Budget = 'Budget'
}

export interface IFileSearch {
  "nextPageToken": string,
  "kind": string,
  "incompleteSearch": boolean,
  "files": FileResource[]
}
