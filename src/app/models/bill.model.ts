import {Month} from "./shared.model";

export interface IPayee {
  name: string;
}
export interface IBill {
  id: string
  payee: IPayee;
  month: Month;
  year: number;
  amount: number | null;
}
