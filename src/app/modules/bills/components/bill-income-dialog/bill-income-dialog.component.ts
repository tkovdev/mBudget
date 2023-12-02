import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {BillsService} from "../../../../services/bills.service";
import {IIncome} from "../../../../models/bill.model";
import {Month} from "../../../../models/shared.model";

@Component({
  selector: 'app-bill-income-dialog',
  templateUrl: './bill-income-dialog.component.html',
  styleUrls: ['./bill-income-dialog.component.scss']
})
export class BillIncomeDialogComponent implements OnInit{
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  @Input() selectedMonthYear!: string;
  incomeForm: FormGroup = this.initIncomeForm();
  payers: string[] = [];
  filteredPayers: string[] = [];

  constructor(private billsService: BillsService) {
  }

  ngOnInit() {
    this.billsService.getIncomePayers().subscribe((res) => {
      this.payers = res;
    })
  }

  initIncomeForm(): FormGroup {
    return new FormGroup({
      payer: new FormControl({value: null, disabled: false}, [Validators.required, Validators.minLength(3)]),
      amount: new FormControl({value: null, disabled: false}, [Validators.required, Validators.min(0)])
    })
  }

  saveIncome(): void{
    let monthYear: string[] = this.selectedMonthYear.split(' ');
    let income: IIncome = {
      payer: {name: this.incomeForm.controls['payer'].value},
      amount: this.incomeForm.controls['amount'].value,
      month: monthYear[0] as Month,
      year: parseInt(monthYear[1])
    };
    this.billsService.addIncome(income).subscribe((res) => {
      this.incomeForm = this.initIncomeForm();
      this.close.emit();
    });

  }

  autoComplete(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.payers.length; i++) {
      let payers = this.payers[i];
      if (payers.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(payers);
      }
    }

    this.filteredPayers = filtered;
  }

}
