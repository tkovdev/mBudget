import {Injectable} from '@angular/core';
import {BillsService} from "./bills.service";
import {combineLatest, forkJoin, map, mergeMap, Observable} from "rxjs";
import {KeyValue} from "@angular/common";
import {Month} from "../models/shared.model";
import {SharedService} from "./shared.service";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private billsService: BillsService, private sharedService: SharedService) { }

  public yearOverYearSpend(year: number = this.sharedService.currentYear()): Observable<IYearOverYearSpend>{
    let spend: IYearOverYearSpend = { unaccounted: [], total: [], outgoing: [], remaining: []};
    return combineLatest({
      bills: this.billsService.getYearToDateBills(),
      balances: this.billsService.getYearToDateBalances(),
      income: this.billsService.getYearToDateIncome()
    }).pipe(
        map((combine) => {
          Object.keys(Month).forEach((month, i) => {
            let monthOutgoing = 0;
            monthOutgoing = combine.bills.filter(x => x.month == month && x.amount != null).reduce((acc, currentValue) => acc + currentValue.amount!, monthOutgoing)

            let monthUnaccounted = 0;
            if(i > 0 && monthOutgoing > 0) {
              monthUnaccounted = spend.outgoing[i-1].value - combine.balances.filter(x => x.month == month && x.amount != null).reduce((acc, currentValue) => acc + currentValue.amount!, monthUnaccounted)
            }
            if(monthUnaccounted < 0) monthUnaccounted = 0;

            let monthTotal = monthOutgoing + monthUnaccounted;

            let monthRemaining = 0
            monthRemaining = combine.income.filter(x => x.month == month && x.amount != null).reduce((acc, currentValue) => acc + currentValue.amount!, monthRemaining) - monthTotal

            spend.outgoing.push({key: <Month> month, value: monthOutgoing});
            spend.unaccounted.push({key: <Month> month, value: monthUnaccounted});
            spend.total.push({key: <Month> month, value: monthTotal});
            spend.remaining.push({key: <Month> month, value: monthRemaining});
          });
          return spend;
    }));
  }
}

export interface IYearOverYearSpend {
  outgoing: KeyValue<Month, number>[];
  total: KeyValue<Month, number>[];
  unaccounted: KeyValue<Month, number>[];
  remaining: KeyValue<Month, number>[];
}
