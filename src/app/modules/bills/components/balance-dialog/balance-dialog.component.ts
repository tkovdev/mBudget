import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BillsService} from "../../../../services/bills.service";
import {IBalance} from "../../../../models/bill.model";
import {Month} from "../../../../models/shared.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-balance-dialog',
  templateUrl: './balance-dialog.component.html',
  styleUrls: ['./balance-dialog.component.scss']
})
export class BalanceDialogComponent implements OnInit{
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input() selectedMonthYear!: string;
  @Input('balance') balance!: IBalance;

  balanceForm: FormGroup = new FormGroup({});

  constructor(private billsService: BillsService) {
  }

  ngOnInit(): void {
    this.initBalanceForm(this.balance);
  }

  initBalanceForm(balance: IBalance): void {
    this.balanceForm.setControl('amount', new FormControl({value: balance.amount, disabled: false}, [Validators.required, Validators.min(0)]))
  }

  saveBalance(): void {
    let monthYear: string[] = this.selectedMonthYear.split(' ');
    let balance: IBalance = {
      amount: this.balanceForm.controls['amount'].value,
      month: monthYear[0] as Month,
      year: parseInt(monthYear[1])
    }
    this.billsService.updateBalance(balance).subscribe((res) => {
      this.close.emit();
    });
  }
}
