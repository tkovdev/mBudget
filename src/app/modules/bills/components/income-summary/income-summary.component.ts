import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {IBill, IIncome} from "../../../../models/bill.model";

@Component({
  selector: 'app-income-summary',
  templateUrl: './income-summary.component.html',
  styleUrls: ['./income-summary.component.scss']
})
export class IncomeSummaryComponent {
  @Input('income') income$: Observable<IIncome[]> = new Observable<IIncome[]>();


}
