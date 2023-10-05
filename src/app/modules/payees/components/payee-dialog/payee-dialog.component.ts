import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BillsService} from "../../../../services/bills.service";

@Component({
  selector: 'app-payee-dialog',
  templateUrl: './payee-dialog.component.html',
  styleUrls: ['./payee-dialog.component.scss']
})
export class PayeeDialogComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  payeeForm: FormGroup = this.initPayeeForm();

  constructor(private billsService: BillsService) {
  }


  initPayeeForm(): FormGroup {
    return new FormGroup({
      name: new FormControl({value: null, disabled: false}, [Validators.required, Validators.minLength(3)]),
    });
  }

  savePayee(): void {
    this.billsService.addPayee(this.payeeForm.value).subscribe((res) => {
      this.payeeForm = this.initPayeeForm();
      this.close.emit();
    });
  }
}
