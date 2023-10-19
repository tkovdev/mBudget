import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BillsService} from "../../../../services/bills.service";
import {Month} from "../../../../models/shared.model";
import {SharedService} from "../../../../services/shared.service";
import {IBill, IPayee} from "../../../../models/bill.model";
import {map} from "rxjs";

@Component({
  selector: 'app-month-year-dialog',
  templateUrl: './month-year-dialog.component.html',
  styleUrls: ['./month-year-dialog.component.scss']
})
export class MonthYearDialogComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  monthYearForm: FormGroup = this.initMonthYearFormForm();

  months: string[] = Object.values(Month);
  constructor(private billsService: BillsService, private sharedService: SharedService) {
  }


  initMonthYearFormForm(): FormGroup {
    return new FormGroup({
      month: new FormControl({value: this.sharedService.currentMonth().valueOf(), disabled: false}, [Validators.required, Validators.minLength(3)]),
      year: new FormControl({value: this.sharedService.currentYear(), disabled: false}, [Validators.required, Validators.min(1990), Validators.max(2060)]),
    });
  }

  saveMonthYear(): void {
    let selectedYear: number = this.monthYearForm.controls['year'].value;
    let selectedMonth: Month = this.monthYearForm.controls['month'].value;
    this.billsService.getAllPayees().pipe(map(payees => {
      return payees.map((payee) => {
        return {year: selectedYear, amount: null, payee: payee, month: selectedMonth} as IBill;
      });
    })).subscribe((bills: IBill[]) => {
      this.billsService.addBill(bills).subscribe((res) => {
        this.monthYearForm = this.initMonthYearFormForm();
        this.close.emit();
      });
    });
  }
}
