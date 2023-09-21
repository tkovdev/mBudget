import {Component, OnInit} from '@angular/core';
import {IBill, IPayee} from "../../../../models/bill.model";
import {Observable} from "rxjs";
import {BillsService} from "../../../../services/bills.service";
import {SharedService} from "../../../../services/shared.service";

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit{
  payees$: Observable<IPayee[]> = this.billsService.getAllPayees();
  bills$: Observable<IBill[]> = this.billsService.getCurrentMonthBills();
  currentMonthYear: string = this.sharedService.currentMonthYear();

  constructor(private billsService: BillsService, private sharedService: SharedService) {
  }

  ngOnInit(): void {
  }
}
