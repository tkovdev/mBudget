import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {IBill, IIncome} from "../../../../models/bill.model";
import {BillsService} from "../../../../services/bills.service";
import {SharedService} from "../../../../services/shared.service";
import {AnalyticsService, IMonthlyIncomeExpenses} from "../../../../services/analytics.service";

@Component({
  selector: 'app-net-monthly-graph',
  templateUrl: './net-monthly-graph.component.html',
  styleUrls: ['./net-monthly-graph.component.scss']
})
export class NetMonthlyGraphComponent implements OnInit{
  loading: boolean = false;
  incomeExpenses$: Observable<IMonthlyIncomeExpenses> = this.analyticsService.monthlyIncomeVsExpenses();
  data: any;

  selectedMonthYear: string = this.sharedService.currentMonthYear();
  monthYearOptions: string[] = [];
  noData: boolean = false;

  options: any;

  constructor(private analyticsService: AnalyticsService, private billsService: BillsService, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.billsService.getAllBillMonthYears().subscribe((monthYears) => {
      this.monthYearOptions = monthYears;
    });
    this.loadGraph();
  }

  loadGraph(): void {
    this.loading = true;
    this.incomeExpenses$.subscribe((incomeExpenses) => {
      if(incomeExpenses.income == 0 && incomeExpenses.expenses == 0) this.noData = true;
      else this.noData = false;
      this.data = {
        labels: ['Incoming', 'Outgoing'],
        datasets: [
          {
            data: [incomeExpenses.income, incomeExpenses.expenses],
            backgroundColor: ['#A8FFC7', '#ffa4a4'],
          }
        ]
      };
      this.loading = false;
    });

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: 'black'
          }
        }
      }
    };
  }

  monthYearChanged(): void {
    this.incomeExpenses$ = this.analyticsService.monthlyIncomeVsExpenses(this.selectedMonthYear);
    this.loadGraph();
  }


}
