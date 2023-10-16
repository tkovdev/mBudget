import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {IBill, IIncome} from "../../../../models/bill.model";
import {BillsService} from "../../../../services/bills.service";

@Component({
  selector: 'app-net-monthly-graph',
  templateUrl: './net-monthly-graph.component.html',
  styleUrls: ['./net-monthly-graph.component.scss']
})
export class NetMonthlyGraphComponent implements OnInit{
  loading: boolean = false;
  income$: Observable<IIncome[]> = this.billsService.getMonthIncome();
  bills$: Observable<IBill[]> = this.billsService.getMonthBills();
  data: any;

  options: any;

  constructor(private billsService: BillsService) {
  }

  ngOnInit(): void {
    let incomeTotal = 0;
    let billTotal = 0;
    this.loading = true;
    this.income$.subscribe((incomes) => {
      this.bills$.subscribe((bills) => {
        incomeTotal = incomes.map(x => x.amount).reduce((acc, currentValue) => acc + currentValue, incomeTotal)
        billTotal = bills.filter(x => x.amount != null).map(x => x.amount as number).reduce((acc, currentValue) => acc + currentValue, billTotal)
        this.data = {
          labels: ['Incoming', 'Outgoing'],
          datasets: [
            {
              data: [incomeTotal, billTotal],
              backgroundColor: ['#A8FFC7', '#ffa4a4'],
            }
          ]
        };
        this.loading = false;
      });
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


}
