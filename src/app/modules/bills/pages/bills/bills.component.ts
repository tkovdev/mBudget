import {Component, OnInit} from '@angular/core';
import {IBill, IPayee} from "../../../../models/bill.model";
import {Observable} from "rxjs";
import {BillsService} from "../../../../services/bills.service";
import {SharedService} from "../../../../services/shared.service";
import {FilesService} from "../../../../services/files.service";
import {Month} from "../../../../models/shared.model";

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit{
  payees$: Observable<IPayee[]> = this.billsService.getAllPayees();
  bills$: Observable<IBill[]> = this.billsService.getMonthBills();
  currentMonthYear: string = this.sharedService.currentMonthYear();
  constructor(private billsService: BillsService, private fileService: FilesService, private sharedService: SharedService) {
  }

  ngOnInit(): void {
  }

  updateBill(bill: IBill): void {
    this.billsService.updateBill(bill).subscribe((res) => {
      this.bills$ = this.billsService.getMonthBills();
    })
  }
}
