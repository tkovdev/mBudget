import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {IPayee} from "../../../../models/bill.model";
import {BillsService} from "../../../../services/bills.service";

@Component({
  selector: 'app-payees',
  templateUrl: './payees.component.html',
  styleUrls: ['./payees.component.scss']
})
export class PayeesComponent implements OnInit{
  payees: IPayee[] = [];

  constructor(private billsService: BillsService) {
  }

  ngOnInit() {
    this.billsService.getAllPayees().subscribe((res) => {
      this.payees = res;
    });
  }

  deletePayee(payee: IPayee): void {
    this.billsService.deletePayee(payee).subscribe((res) => {
      this.billsService.getAllPayees().subscribe((res) => {
        this.payees = res;
      });
    })
  }

}
