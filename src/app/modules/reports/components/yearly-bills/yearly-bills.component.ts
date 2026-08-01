import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { IYearlyBillSummary, ReportsService } from '../../../../services/reports.service';

interface YearlyBillItem {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-yearly-bills',
  templateUrl: './yearly-bills.component.html',
  styleUrls: ['./yearly-bills.component.scss'],
  standalone: false
})
export class YearlyBillsComponent implements OnChanges {
  @Input() year: number | null = new Date().getFullYear();
  @Input() years: number[] = [];
  @Input() billNames: string[] = [];
  @Output() yearChange = new EventEmitter<number>();

  billItems: YearlyBillItem[] = [];
  yearlyBillTotalsEntries: Array<[string, IYearlyBillSummary]> = [];
  yearlyBillTotalsSum = 0;
  yearlyBillAverageSum = 0;

  constructor(private reportsService: ReportsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['year'] || changes['billNames']) {
      this.loadBillsFromPayees();
    }
  }

  onYearChanged(): void {
    if (this.year === null) {
      return;
    }

    this.yearChange.emit(this.year);
  }

  loadBillsFromPayees(): void {
    const sourceBills = this.billNames;

    this.billItems = sourceBills.map((name, index) => ({
      name,
      selected: index < 2
    }));
  }

  run(): void {
    if (this.year === null) {
      return;
    }

    const selectedBillNames = this.billItems.filter((item) => item.selected).map((item) => item.name);

    this.reportsService.getYearlyBillTotals(this.year, selectedBillNames).subscribe((totals) => {
      this.yearlyBillTotalsEntries = Object.entries(totals);
      this.yearlyBillTotalsSum = this.yearlyBillTotalsEntries.reduce((sum, entry) => sum + entry[1].total, 0);
      this.yearlyBillAverageSum = this.yearlyBillTotalsEntries.reduce((sum, entry) => sum + entry[1].average, 0);
    });
  }
}