import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {BudgetsService} from "../../../../services/budgets.service";
import {IBudget} from "../../../../models/budget.model";

@Component({
  selector: 'app-budget-category-item',
  templateUrl: './budget-category-item.component.html',
  styleUrls: ['./budget-category-item.component.scss']
})
export class BudgetCategoryItemComponent implements OnInit{
  @Output() save: EventEmitter<void> = new EventEmitter<void>();
  @Input() fgBudget!: FormGroup;
  @Input() category!: 'need' | 'want' | 'extra';

  fgBudgetItem!: FormGroup;

  constructor(private budgetService: BudgetsService) {
  }

  ngOnInit(): void {
    this.fgBudgetItem = this.initBudgetItemFormGroup();
  }

  emitSave(): void {
    this.budgetService.addBudgetItem(this.fgBudget.get('name')?.getRawValue(), this.category, this.fgBudgetItem.getRawValue()).subscribe((res) => {
      (this.fgBudget.get(this.category) as FormArray).push(this.fgBudgetItem)
      this.fgBudgetItem = this.initBudgetItemFormGroup()
      this.save.emit();
    });
  }

  initBudgetItemFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl({value: null, disabled: false}, {validators:[Validators.required, Validators.minLength(3), Validators.maxLength(16)]}),
      amount: new FormControl({value: null, disabled: false}, {validators:[Validators.required]}),
    });
  }
}
