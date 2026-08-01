import { Component, OnInit } from '@angular/core';
import { BillsService } from '../../../../services/bills.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  standalone: false
})
export class ReportsComponent implements OnInit {
  availableYears: number[] = [];
  availableBillNames: string[] = [];
  selectedYear = new Date().getFullYear();

  constructor(private billsService: BillsService) { }

  ngOnInit(): void {
    this.billsService.getAvailableYears().subscribe((years) => {
      this.availableYears = years;
      if (years.length > 0 && !years.includes(this.selectedYear)) {
        this.selectedYear = years[0];
      }
      this.loadBillNamesForYear(this.selectedYear);
    });
  }

  onYearSelected(year: number): void {
    this.selectedYear = year;
    this.loadBillNamesForYear(year);
  }

  private loadBillNamesForYear(year: number): void {
    this.billsService.getYearToDateBillNames(year).subscribe((billNames) => {
      this.availableBillNames = billNames;
    });
  }
}