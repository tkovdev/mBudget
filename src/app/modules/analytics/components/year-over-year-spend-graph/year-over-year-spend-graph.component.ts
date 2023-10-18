import {Component, OnInit} from '@angular/core';
import {Month} from "../../../../models/shared.model";
import {AnalyticsService} from "../../../../services/analytics.service";

@Component({
  selector: 'app-year-over-year-spend-graph',
  templateUrl: './year-over-year-spend-graph.component.html',
  styleUrls: ['./year-over-year-spend-graph.component.scss']
})
export class YearOverYearSpendGraphComponent implements OnInit {
  data: any;
  options: any;

  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {
    this.analyticsService.yearOverYearSpend().subscribe((spend) => {
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


}
