import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {IBill, IPayee} from "../../../../models/bill.model";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable} from "rxjs";
import {BillsService} from "../../../../services/bills.service";
import {Month} from "../../../../models/shared.model";

@Component({
  selector: 'app-bill-pay-dialog',
  templateUrl: './bill-pay-dialog.component.html',
  styleUrls: ['./bill-pay-dialog.component.scss']
})
export class BillPayDialogComponent implements OnInit{
  @Input() selectedMonthYear!: string;
  @Input('payees') payees: IPayee[] = [];
  @Input('bills') bills: IBill[] = [];

  @Output() close: EventEmitter<void> = new EventEmitter<void>();


  billForm: FormGroup = new FormGroup<any>({bills: new FormGroup([])});
  currentBills: IBill[] = [];

  hiddenPayees: IPayee[] = [];

  constructor(private billsService: BillsService) {}

  ngOnInit(): void {
      this.initBillFormControls(this.bills);
    }

  initBillFormControls(bills: IBill[]): void {
    bills.map(x => x.payee).forEach((payee) => {
      let currentBill: IBill | undefined = bills.find(x => x.payee.name == payee.name);
      let currentBillAmount: number | null = null;
      if(currentBill) currentBillAmount = currentBill.amount;
      (this.billForm.controls['bills'] as FormGroup).addControl(payee.name, new FormControl({value: currentBillAmount, disabled: false}));
    });
    this.currentBills = bills;
  }

  hidePayee(payee: IPayee): void {
    this.hiddenPayees.push(payee);
  }

  showPayee(payee: IPayee): void {
    let selectedMonthYear: string[] = this.selectedMonthYear.split(' ');
    let month: Month = Month[selectedMonthYear[0] as keyof typeof Month];
    let year: number = parseInt(selectedMonthYear[1]);
    let bill = {payee: payee, month: month, year: year, amount: null};
    this.billsService.addBill(bill).subscribe((res) => {
      this.close.emit();
    });
  }

  showAllPayees(payees: IPayee[]): void {
    let selectedMonthYear: string[] = this.selectedMonthYear.split(' ');
    let month: Month = Month[selectedMonthYear[0] as keyof typeof Month];
    let year: number = parseInt(selectedMonthYear[1]);
    let bills: IBill[] = [];
    payees.forEach((payee) => {
      bills.push({payee: payee, month: month, year: year, amount: null});
    })
    this.billsService.addBill(bills).subscribe((res) => {
      this.close.emit();
    });
  }

  payeeHidden(payee: IPayee): boolean {
    return this.hiddenPayees.findIndex(x => x.name == payee.name) > -1;
  }

  saveBill(): void {
    let addBills: IBill[] = [];
    let updateBills: IBill[] = [];
    let selectedMonthYear: string[] = this.selectedMonthYear.split(' ');
    for(let control of Object.keys((this.billForm.controls['bills'] as FormGroup).controls)){
      //skip hidden payees
      if(this.hiddenPayees.findIndex(x => x.name == control) > -1) continue;

      let amount = (this.billForm.controls[`bills`] as FormGroup).controls[control].value as number;
      let payee: IPayee = {name: control}
      let month: Month = Month[selectedMonthYear[0] as keyof typeof Month];
      let year: number = parseInt(selectedMonthYear[1]);
      let bill = {payee: payee, month: month, year: year, amount: amount};
      let billIdx = this.currentBills.findIndex(x => `${x.month} ${x.year}` == `${bill.month} ${bill.year}` && x.payee.name == bill.payee.name)
      if(billIdx > -1){
        updateBills.push(bill);
      }else{
        addBills.push(bill);
      }
    }
    this.billsService.updateBill(updateBills).subscribe((res) => {
      this.billsService.addBill(addBills).subscribe((res) => {
        if(this.hiddenPayees.length > 0) {
          this.billsService.deleteBill(this.selectedMonthYear, this.hiddenPayees).subscribe((res) => {
            this.close.emit();
          });
        }else{
            this.close.emit();
        }
      });
    });
  }

  missingPayees(allPayees: IPayee[], bills: IBill[]): IPayee[] {
    let currentPayees = bills.map(x => x.payee);
    return allPayees.filter(x => !currentPayees.some(y => y.name == x.name));
  }

  protected readonly FormGroup = FormGroup;
}
