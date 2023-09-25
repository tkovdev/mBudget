import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {IBill} from "../../../../models/bill.model";

@Component({
  selector: 'app-bill-summary',
  templateUrl: './bill-summary.component.html',
  styleUrls: ['./bill-summary.component.scss']
})
export class BillSummaryComponent {
  @Input('bills') bills$: Observable<IBill[]> = new Observable<IBill[]>();
}
