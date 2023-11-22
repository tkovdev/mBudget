import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-budget-dialog',
  templateUrl: './budget-dialog.component.html',
  styleUrls: ['./budget-dialog.component.scss']
})
export class BudgetDialogComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  budgetForm: FormGroup = this.initBudgetForm();

  constructor() {
  }


  initBudgetForm(): FormGroup {
    return new FormGroup({
      name: new FormControl({value: null, disabled: false}, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
    });
  }

  saveBudget(): void {
    // this.billsService.addPayee(this.payeeForm.value).subscribe((res) => {
    //   this.payeeForm = this.initPayeeForm();
    //   this.close.emit();
    // });
  }
}
