import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-budget-action-bar',
  templateUrl: './budget-action-bar.component.html',
  styleUrls: ['./budget-action-bar.component.scss']
})
export class BudgetActionBarComponent {
  @Input('budgets') budgets: string[] = [];
  @Input('selectedBudget') selectedBudget!: string;
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
}
