import {IBalance, IBill, IIncome, IPayee} from "./bill.model";
import {IBudget, IBudgetBreakdown} from "./budget.model";

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

export interface IBudgetSchema {
  budgets: IBudget[];
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

export interface FileResourceExt extends gapi.client.drive.File {
  id: string;
  name: string;
  modifiedTime: string;
  createdTime: string;
  size: string;
}
