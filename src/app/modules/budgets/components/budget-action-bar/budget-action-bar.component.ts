import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IBudget} from "../../../../models/budget.model";

@Component({
  selector: 'app-budget-action-bar',
  templateUrl: './budget-action-bar.component.html',
  styleUrls: ['./budget-action-bar.component.scss']
})
export class BudgetActionBarComponent {
  @Input('budgets') budgets: string[] = [];
  @Input('selectedBudget') selectedBudget!: string;
  @Input('budget') budget!: IBudget;
  @Output() budgetChanged: EventEmitter<void> = new EventEmitter<void>();
  @Output() budgetDeleted: EventEmitter<string> = new EventEmitter<string>();
  @Output() budgetSelectionChanged: EventEmitter<string> = new EventEmitter<string>();

  budgetDialog: boolean = false;

  constructor() {
  }

  budgetChangedEvent(): void {
    this.budgetChanged.emit();
  }

  budgetSelectedEvent(selectedBudget: string): void {
    this.budgetSelectionChanged.emit(selectedBudget);
  }

  deleteBudget(name: string): void {
    this.budgetDeleted.emit(name);
  }

  get remaining(): number {
    let need = this.budget.breakdown.need.monthlyTotal!;
    let want = this.budget.breakdown.want.monthlyTotal!;
    let extra = this.budget.breakdown.extra.monthlyTotal!;
    return (this.budget.income.net - (need + want + extra));
  }
}
