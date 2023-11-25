import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BudgetsService} from "../../../../services/budgets.service";

@Component({
  selector: 'app-budget-dialog',
  templateUrl: './budget-dialog.component.html',
  styleUrls: ['./budget-dialog.component.scss']
})
export class BudgetDialogComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  budgetForm: FormGroup = this.initBudgetForm();

  constructor(private budgetService: BudgetsService) {
  }


  initBudgetForm(): FormGroup {
    return new FormGroup({
      name: new FormControl({value: null, disabled: false}, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
    });
  }

  saveBudget(): void {
    this.budgetService.addBudget(this.budgetForm.controls['name'].value).subscribe((res) => {
      this.budgetForm = this.initBudgetForm();
      this.close.emit();
    });
  }
}
