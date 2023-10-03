import {Component, EventEmitter, Input, Output} from '@angular/core';
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
export class BillPayDialogComponent {
  @Input() selectedMonthYear!: string;
  @Input('payees') payees$: Observable<IPayee[]> = new Observable<IPayee[]>();
  @Input('bills') bills$: Observable<IBill[]> = new Observable<IBill[]>();

  @Output() close: EventEmitter<void> = new EventEmitter<void>();


  billForm: FormGroup = new FormGroup<any>({bills: new FormGroup([])});
  currentBills: IBill[] = [];

  hiddenPayees: IPayee[] = [];
  constructor(private billsService: BillsService) {
  }

  initBillFormControl(payee: IPayee, bills: IBill[]): boolean {
    let currentBill: IBill | undefined = bills.find(x => x.payee.name == payee.name);
    let currentBillAmount: number | null = null;
    if(currentBill) currentBillAmount = currentBill.amount;
    (this.billForm.controls['bills'] as FormGroup).addControl(payee.name, new FormControl({value: currentBillAmount, disabled: false}));
    return true;
  }

  hidePayee(payee: IPayee): void {
    this.hiddenPayees.push(payee);
  }

  payeeHidden(payee: IPayee): boolean {
    return this.hiddenPayees.findIndex(x => x.name == payee.name) > -1;
  }

  saveBill(): void {
    let addBills: IBill[] = [];
    let updateBills: IBill[] = [];
    let selectedMonthYear: string[] = this.selectedMonthYear.split(' ');
    for(let control of Object.keys((this.billForm.controls['bills'] as FormGroup).controls)){
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
        this.close.emit();
      });
    });
  }
}
