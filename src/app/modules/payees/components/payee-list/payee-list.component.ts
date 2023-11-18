import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from "rxjs";
import {IPayee} from "../../../../models/bill.model";

@Component({
  selector: 'app-payee-list',
  templateUrl: './payee-list.component.html',
  styleUrls: ['./payee-list.component.scss']
})
export class PayeeListComponent {
  @Input('payees') payees: IPayee[] = [];
  @Output() deletePayee: EventEmitter<IPayee> = new EventEmitter<IPayee>();
  constructor() {
  }

  delete(payee: IPayee): void{
    this.deletePayee.emit(payee);
  }

}
