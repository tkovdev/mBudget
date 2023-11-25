import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IBudget} from "../../../../models/budget.model";
import {BudgetsService} from "../../../../services/budgets.service";

@Component({
  selector: 'app-budget-income-debt',
  templateUrl: './budget-income-debt.component.html',
  styleUrls: ['./budget-income-debt.component.scss']
})
export class BudgetIncomeDebtComponent {
  @Output('budgetChanged') budgetChanged: EventEmitter<void> = new EventEmitter<void>();
  @Input('budget') budget!: IBudget;

  constructor(private budgetService: BudgetsService) {
  }

  get incomeHourly(): number {
    return this.budget.income / 4 / 40 | 0;
  }

  get incomeSalary(): number {
    return this.budget.income * 12 | 0;
  }

  get debtToIncome(): number {
    if(this.budget.income == 0) return 0;
    return this.budget.debt / this.budget.income;
  }

  save(): void {
    this.budgetService.saveDebtToIncome(this.budget).subscribe((res) => {
      this.budgetChanged.emit();
    })
  }
}
