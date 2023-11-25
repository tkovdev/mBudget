import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BudgetsService} from "../../../../services/budgets.service";
import {IBudget} from "../../../../models/budget.model";

@Component({
  selector: 'app-budget-category-item',
  templateUrl: './budget-category-item.component.html',
  styleUrls: ['./budget-category-item.component.scss']
})
export class BudgetCategoryItemComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input('budget') budget!: IBudget;
  @Input('category') category!: 'need' | 'want' | 'extra';
  budgetItemForm: FormGroup = this.initBudgetItemForm();

  constructor(private budgetService: BudgetsService) {
  }


  initBudgetItemForm(): FormGroup {
    return new FormGroup({
      name: new FormControl({value: null, disabled: false}, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
      amount: new FormControl({value: 0, disabled: false}, [Validators.required]),
    });
  }

  saveBudgetItem(): void {
    this.budgetService.addBudgetItem(this.budget.name, this.category, this.budgetItemForm.getRawValue()).subscribe((res) => {
      this.budgetItemForm = this.initBudgetItemForm();
      this.close.emit();
    });
  }
}
