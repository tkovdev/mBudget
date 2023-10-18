import {IBalance, IBill, IIncome, IPayee} from "./bill.model";
import FileResource = gapi.client.drive.FileResource;

export interface IDriveSchema {
  name: string;
  date: Date;
  schemaIds: ISchemaItem[]
}

export interface ISchemaItem {
  id: string
  type: SchemaType
}

export enum SchemaType {
  Bill = 'Bill',
  Budget = 'Budget'
}

export interface IBillSchema {
  payees: IPayee[];
  bills: IBill[];
  income: IIncome[];
  balances: IBalance[];
}

export interface IFileSearch {
  "nextPageToken": string,
  "kind": string,
  "incompleteSearch": boolean,
  "files": FileResourceExt[]
}

export interface IFileSearchDetails {
  "files": FileResourceExt[]
}

export interface FileResourceExt extends FileResource {
  name: string;
  modifiedTime: string;
  createdTime: string;
}
