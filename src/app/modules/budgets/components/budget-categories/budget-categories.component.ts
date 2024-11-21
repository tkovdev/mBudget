import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BudgetsService} from "../../../../services/budgets.service";
import { FormArray, FormGroup} from "@angular/forms";
import {OverlayPanel} from "primeng/overlaypanel";

@Component({
  selector: 'app-budget-categories',
  templateUrl: './budget-categories.component.html',
  styleUrls: ['./budget-categories.component.scss']
})
export class BudgetCategoriesComponent implements OnInit{
  @Input() category!: 'need' | 'want' | 'extra'
  @Input() fgBudget!: FormGroup;

  editing: boolean = false;

  @ViewChild('budgetItemPanel') budgetItemPanel!: OverlayPanel;

  constructor(private budgetService: BudgetsService) {
  }

  ngOnInit(): void {
  }

  deleteItem(index: number): void {
    let budgetItem = (this.fgBudget.controls[this.category] as FormArray).at(index);
    this.budgetService.removeBudgetItem(this.fgBudget.get('name')?.getRawValue(), this.category, budgetItem.get('name')?.getRawValue()).subscribe((res) => {
      (this.fgBudget.controls[this.category] as FormArray).removeAt(index);
    });
  }

  saveItem(index: number): void {
    let budgetItem = (this.fgBudget.controls[this.category] as FormArray).at(index);
    this.budgetService.updateBudgetItem(this.fgBudget.get('name')?.getRawValue(), this.category, budgetItem.getRawValue()).subscribe((res) => {
      this.fgBudget.markAsPristine()
      this.fgBudget.markAsUntouched()
    })
  }

  edit(): void {
    this.editing = !this.editing;
  }

  get categoryFormArray(): FormArray {
    return this.fgBudget.get(this.category) as FormArray
  }
}
