import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {IBill, IPayee} from "../models/bill.model";
import {Month} from "../models/shared.model";

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  constructor() { }

  public getCurrentMonthBills(): Observable<IBill[]> {
    return new Observable<IBill[]>((subscriber) => {
      setTimeout(() => {
        subscriber.next(this.tempBills);
      }, 2000)
    });
  }

  public getAllPayees(): Observable<IPayee[]> {
    return new Observable<IPayee[]>((subscriber) => {
      setTimeout(() => {
        subscriber.next(this.tempPayees);
      }, 2000)
    });
  }

  private tempPayees: IPayee[] = [
    {
      name: 'Gas'
    },
    {
      name: 'Electric'
    },
    {
      name: 'Water'
    }
  ]
  private tempBills: IBill[] = [
    {
      payee: this.tempPayees[0],
      amount: null,
      year: 2023,
      month: Month.September
    },
    {
      payee: this.tempPayees[1],
      amount: 100,
      year: 2023,
      month: Month.September
    },
    {
      payee: this.tempPayees[2],
      amount: null,
      year: 2023,
      month: Month.September
    }
  ]
}
