import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBill, IPayee} from "../../../../models/bill.model";
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
  @Output() monthYearChanged: EventEmitter<void> = new EventEmitter<void>();
  @Output() monthYearSelected: EventEmitter<string> = new EventEmitter<string>();

  monthYears: string[] = [];
  @Input() selectedMonthYear!: string;
  @Input('billMonthYears') billsMonthYears$!: Observable<string[]>;

  @Input('payees') payees$: Observable<IPayee[]> = new Observable<IPayee[]>();
  @Input('bills') bills$: Observable<IBill[]> = new Observable<IBill[]>();

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
}
