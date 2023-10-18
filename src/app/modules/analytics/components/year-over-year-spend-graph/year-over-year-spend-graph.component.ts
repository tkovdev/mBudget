import {Component, OnInit} from '@angular/core';
import {Month} from "../../../../models/shared.model";
import {AnalyticsService, IYearOverYearSpend} from "../../../../services/analytics.service";
import {SharedService} from "../../../../services/shared.service";
import {BillsService} from "../../../../services/bills.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-year-over-year-spend-graph',
  templateUrl: './year-over-year-spend-graph.component.html',
  styleUrls: ['./year-over-year-spend-graph.component.scss']
})
export class YearOverYearSpendGraphComponent implements OnInit {
  spend$: Observable<IYearOverYearSpend> = this.analyticsService.yearOverYearSpend();
  data: any;
  options: any;

  yearOptions: number[] = [];
  selectedYear: number = this.sharedService.currentYear();

  constructor(private analyticsService: AnalyticsService, private sharedService: SharedService, private billsService: BillsService) {
  }

  ngOnInit(): void {
    this.billsService.getAvailableYears().subscribe((years) => {
      this.yearOptions = years;
    });
    this.loadGraph();
  }

  loadGraph(): void {
    this.spend$.subscribe((spend) => {
      this.data = {
        labels: Object.keys(Month),
        datasets: [
          {
            label: 'Outgoing',
            data: spend.outgoing.map(x => x.value),
            fill: false,
            borderColor: 'blue',
            tension: 0.4
          },
          {
            label: 'Unaccounted',
            data: spend.unaccounted.map(x => x.value),
            fill: false,
            borderColor: 'red',
            tension: 0.4
          },
          {
            label: 'Total',
            data: spend.total.map(x => x.value),
            fill: false,
            borderColor: 'yellow',
            tension: 0.4
          },
          {
            label: 'Remaining',
            data: spend.remaining.map(x => x.value),
            fill: false,
            borderColor: 'purple',
            tension: 0.4
          }
        ]
      };

      this.options = {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'black'
            },
            grid: {
              color: 'grey',
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: 'black'
            },
            grid: {
              color: 'grey',
              drawBorder: false
            }
          }
        }
      };
    });
  }

  yearChanged(): void {
    this.spend$ = this.analyticsService.yearOverYearSpend(this.selectedYear);
    this.loadGraph();
  }

}
