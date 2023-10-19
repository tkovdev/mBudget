import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {IPayee} from "../../../../models/bill.model";
import {BillsService} from "../../../../services/bills.service";

@Component({
  selector: 'app-payees',
  templateUrl: './payees.component.html',
  styleUrls: ['./payees.component.scss']
})
export class PayeesComponent {
  payees$: Observable<IPayee[]> = this.billsService.getAllPayees();

  constructor(private billsService: BillsService) {
  }

  deletePayee(payee: IPayee): void {
    this.billsService.deletePayee(payee).subscribe((res) => {
      this.payees$ = this.billsService.getAllPayees();
    })
  }

}
