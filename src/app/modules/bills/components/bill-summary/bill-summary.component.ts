import {Component, Input, Output} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {IBill} from "../../../../models/bill.model";

@Component({
  selector: 'app-bill-summary',
  templateUrl: './bill-summary.component.html',
  styleUrls: ['./bill-summary.component.scss']
})
export class BillSummaryComponent {
  @Output() updateBill: Subject<IBill> = new Subject<IBill>();
  @Input('bills') bills$: Observable<IBill[]> = new Observable<IBill[]>();

  pay(bill: IBill): void{
    if(bill.amount == null) bill.amount = 10;
    else bill.amount = null;
    this.updateBill.next(bill);
  }
}
