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

  public monthlyIncomeVsExpenses(monthYear: string = this.sharedService.currentMonthYear()): Observable<IMonthlyIncomeExpenses> {
    let incomeExpenses: IMonthlyIncomeExpenses = { expenses: 0, income: 0};
    return combineLatest({
      income: this.billsService.getMonthIncome(monthYear),
      expenses: this.billsService.getMonthBills(monthYear)
    }).pipe(
      map((combine) => {
        incomeExpenses.income = combine.income.map(x => x.amount).reduce((acc, currentValue) => acc + currentValue, incomeExpenses.income)
        incomeExpenses.expenses = combine.expenses.filter(x => x.amount != null).map(x => x.amount as number).reduce((acc, currentValue) => acc + currentValue, incomeExpenses.expenses)
        return incomeExpenses;
      }));
  }

  public monthlyIncomingOutgoing(monthYear: string = this.sharedService.currentMonthYear()): Observable<IIncomingOutgoing>{
    let incomingOutgoing: IIncomingOutgoing = { incoming: 0, outgoing: 0, remaining: 0};
    return combineLatest({
      income: this.billsService.getMonthIncome(monthYear),
      balance: this.billsService.getMonthBalance(monthYear),
      expense: this.billsService.getMonthBills(monthYear)
    }).pipe(
      map((combine) => {
        incomingOutgoing.incoming = combine.income.map(x => x.amount).reduce((acc, currentValue) => acc + currentValue, 0)
        incomingOutgoing.incoming += combine.balance.amount ?? 0;
        incomingOutgoing.outgoing = combine.expense.filter(x => x.amount != null).map(x => x.amount as number).reduce((acc, currentValue) => acc + currentValue, 0)
        incomingOutgoing.remaining = incomingOutgoing.incoming - incomingOutgoing.outgoing;
        return incomingOutgoing;
      }));
  }

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

export interface IMonthlyIncomeExpenses {
  income: number;
  expenses: number;
}

export interface IIncomingOutgoing{
  incoming: number;
  outgoing: number;
  remaining: number;
}
