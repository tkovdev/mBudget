import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IBudget, IBudgetItem} from "../../../../models/budget.model";
import {BudgetsService} from "../../../../services/budgets.service";

@Component({
  selector: 'app-budget-categories',
  templateUrl: './budget-categories.component.html',
  styleUrls: ['./budget-categories.component.scss']
})
export class BudgetCategoriesComponent {
  @Output('budgetChanged') budgetChanged: EventEmitter<void> = new EventEmitter<void>();
  @Input('category') category!: 'need' | 'want' | 'extra'
  @Input('budget') budget!: IBudget;

  budgetItemDialog: boolean = false;

  constructor(private budgetService: BudgetsService) {
  }

  getBudgetItemNameId(name: string): string {
    return name.toLowerCase().replace(' ', '-')
  }

  deleteItem(budgetItem: IBudgetItem): void {
    this.budgetService.removeBudgetItem(this.budget.name, this.category, budgetItem.name).subscribe((res) => {
      this.budgetChanged.emit();
    });
  }

  saveItem(budgetItem: IBudgetItem): void {
    this.budgetService.updateBudgetItem(this.budget.name, this.category, budgetItem).subscribe((res) => {
      this.budgetChanged.emit();
    })
  }

  budgetChangedEvent(): void {
    this.budgetChanged.emit();
  }
}
