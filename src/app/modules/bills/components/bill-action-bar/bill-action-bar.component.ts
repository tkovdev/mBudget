import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SharedService} from "../../../../services/shared.service";
import {Month} from "../../../../models/shared.model";
import {IBill, IPayee} from "../../../../models/bill.model";
import {Observable} from "rxjs";
import {DialogService} from "primeng/dynamicdialog";
import {BillPayDialogComponent} from "../bill-pay-dialog/bill-pay-dialog.component";

@Component({
  selector: 'app-bill-action-bar',
  templateUrl: './bill-action-bar.component.html',
  styleUrls: ['./bill-action-bar.component.scss']
})
export class BillActionBarComponent {
  @Output() billChanged: EventEmitter<void> = new EventEmitter<void>();
  @Output() payeeChanged: EventEmitter<void> = new EventEmitter<void>();
  monthYears: string[] = [];
  @Input() selectedMonthYear!: string;
  @Input('billMonthYears') billsMonthYears$!: Observable<string[]>;

  @Input('payees') payees$: Observable<IPayee[]> = new Observable<IPayee[]>();
  @Input('bills') bills$: Observable<IBill[]> = new Observable<IBill[]>();

  constructor() {
  }

  billChangedEvent(): void {
    this.billChanged.emit();
  }

  payeeChangedEvent(): void {
    this.payeeChanged.emit();
  }
}
