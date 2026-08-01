import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { BillsService } from './bills.service';

export interface IYearlyBillSummary {
  total: number;
  average: number;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private billsService: BillsService) { }

  getYearlyBillTotals(year: number, selectedBillNames: string[]): Observable<Record<string, IYearlyBillSummary>> {
    return this.billsService.getYearToDateBills(year).pipe(
      map((bills) => {
        const selectedNames = new Set(selectedBillNames);
        const totals = selectedBillNames.reduce((accumulator, billName) => {
          accumulator[billName] = { total: 0, average: 0, count: 0 };
          return accumulator;
        }, {} as Record<string, IYearlyBillSummary>);

        bills
          .filter((bill) => selectedNames.has(bill.payee.name))
          .forEach((bill) => {
            const billName = bill.payee.name;
            const billAmount = bill.amount ?? 0;
            totals[billName] = totals[billName] ?? { total: 0, average: 0, count: 0 };
            totals[billName].total += billAmount;
            totals[billName].count += 1;
            totals[billName].average = totals[billName].count > 0 ? totals[billName].total / totals[billName].count : 0;
          });

        return totals;
      })
    );
  }

}