import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBill, IIncome, IPayee} from "../../../../models/bill.model";
import {Observable} from "rxjs";
import {MenuItem} from "primeng/api";

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

  monthYears: string[] = [];
  @Input() selectedMonthYear!: string;
  @Input('billMonthYears') billsMonthYears$!: Observable<string[]>;

  @Input('payees') payees$: Observable<IPayee[]> = new Observable<IPayee[]>();
  @Input('bills') bills$: Observable<IBill[]> = new Observable<IBill[]>();
  @Input('income') income$: Observable<IIncome[]> = new Observable<IIncome[]>();

  billPayDialog: boolean = false

  payeeSplitButtonMenu: MenuItem[] = [{label: 'View Payees', routerLink: ['','payees']}];
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
}
