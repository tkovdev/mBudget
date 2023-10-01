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
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  payees$: Observable<IPayee[]> = this.billsService.getAllPayees();
  billFormGroup: FormGroup = new FormGroup<any>([]);
  billForm: FormGroup = new FormGroup<any>({bills: this.billFormGroup});
  currentBills: IBill[] = [];
  constructor(private billsService: BillsService) {
    this.initBillForm();
  }

  initBillForm(): void {
    this.payees$.subscribe((payees) => {
        payees.map((payee) => {
          this.billFormGroup.addControl(payee.name, new FormControl({value: null, disabled: false}));
      })
      this.loadBills(payees);
    });
  }

  loadBills(payees: IPayee[]): void {
    this.billsService.getMonthBills(this.selectedMonthYear).subscribe((currentBills) => {
      this.currentBills = currentBills;
        payees.forEach((payee) => {
          let currentBill: IBill | undefined = currentBills.find(x => x.payee.name == payee.name);
          let currentAmount: number | null = null;
          if(currentBill) currentAmount = currentBill.amount;
          this.billFormGroup.controls[payee.name].setValue(currentAmount)
        })
    })
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
