import {Month} from "./shared.model";

export interface IPayee {
  name: string;
}
export interface IBill {
  payee: IPayee;
  month: Month;
  year: number;
  amount: number | null;
}
