import {Month} from "./shared.model";

export interface IBalance {
  month: Month;
  year: number;
  amount: number | null;
}

export interface IPayer {
  name: string;
}

export interface IIncome {
  payer: IPayer;
  month: Month;
  year: number;
  amount: number;
}

export interface IPayee {
  name: string;
}
export interface IBill {
  payee: IPayee;
  month: Month;
  year: number;
  amount: number | null;
}
