import {Injectable} from '@angular/core';
import {BillsService} from "./bills.service";
import {combineLatest, map, Observable} from "rxjs";
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
    let spend: IYearOverYearSpend = { unaccounted: [], outgoing: [], remaining: []};
    return combineLatest({
      bills: this.billsService.getYearToDateBills(),
      balances: this.billsService.getYearToDateBalances(),
      income: this.billsService.getYearToDateIncome()
    }).pipe(
        map((combine) => {
          Object.keys(Month).forEach((month, i) => {
            let monthOutgoing = 0;
            let monthIncome = 0;
            let monthBalance = 0;
            let monthUnaccounted = 0;
            let monthRemaining = 0;
            let previousMonth = this.sharedService.previousMonth(<Month> month);

            monthOutgoing = combine.bills.filter(x => x.month == <Month> month).map(x => x.amount).reduce((prev, curr) => (prev ?? 0) + (curr ?? 0), 0) ?? 0
            monthIncome = combine.income.filter(x => x.month == <Month> month).map(x => x.amount).reduce((prev, curr) => (prev ?? 0) + (curr ?? 0), 0) ?? 0
            monthBalance = combine.balances.filter(x => x.month == <Month> month).map(x => x.amount).reduce((prev, curr) => (prev ?? 0) + (curr ?? 0), 0) ?? 0
            monthRemaining = (monthIncome + monthBalance) - monthOutgoing;

            if(<Month> month != Month.January){
              let prevMonthSpend = spend.remaining.find(x => x.key == previousMonth)?.value ?? 0;
              monthUnaccounted = -1 * (monthBalance - prevMonthSpend)
              spend.unaccounted.push({key: previousMonth, value: monthUnaccounted});
            }

            spend.outgoing.push({key: <Month> month, value: monthOutgoing});
            spend.remaining.push({key: <Month> month, value: monthRemaining});
          });
          return spend;
    }));
  }
}

export interface IYearOverYearSpend {
  outgoing: KeyValue<Month, number>[];
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
