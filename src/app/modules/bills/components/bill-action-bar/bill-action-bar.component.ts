import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBalance, IBill, IIncome, IPayee} from "../../../../models/bill.model";
import {combineLatest, map, Observable} from "rxjs";
import {MenuItem} from "primeng/api";
import {IIncomingOutgoing} from "../../../../services/analytics.service";

@Component({
  selector: 'app-bill-action-bar',
  templateUrl: './bill-action-bar.component.html',
  styleUrls: ['./bill-action-bar.component.scss']
})
export class BillActionBarComponent{
  @Output() billChanged: EventEmitter<void> = new EventEmitter<void>();
  @Output() payeeChanged: EventEmitter<void> = new EventEmitter<void>();
  @Output() incomeChanged: EventEmitter<void> = new EventEmitter<void>();
  @Output() monthYearChanged: EventEmitter<void> = new EventEmitter<void>();
  @Output() monthYearSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() balanceChanged: EventEmitter<void> = new EventEmitter<void>();

  monthYears: string[] = [];
  @Input() selectedMonthYear!: string;
  @Input('billMonthYears') billsMonthYears: string[] = [];

  @Input('payees') payees: IPayee[] = [];
  @Input('bills') bills: IBill[] = [];
  @Input('income') incomes: IIncome[] = [];
  @Input('balance') balance!: IBalance;
  @Input('incomingOutgoing') incomingOutgoing!: IIncomingOutgoing;

  billPayDialog: boolean = false
  balanceDialog: boolean = false

  constructor() {
  }

  billChangedEvent(): void {
    this.billChanged.emit();
  }

  payeeChangedEvent(): void {
    this.payeeChanged.emit();
  }

  monthYearChangedEvent(): void {
    this.monthYearChanged.emit();
  }

  monthYearSelectedEvent(monthYear: string): void {
    this.monthYearSelected.emit(monthYear);
  }

  incomeChangedEvent(): void {
    this.incomeChanged.emit();
  }

  balanceChangedEvent(): void {
    this.balanceChanged.emit();
  }
}
