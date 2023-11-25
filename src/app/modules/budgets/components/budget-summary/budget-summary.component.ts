import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IBudget, IBudgetBreakdown} from "../../../../models/budget.model";
import {BudgetsService} from "../../../../services/budgets.service";

@Component({
  selector: 'app-budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss']
})
export class BudgetSummaryComponent {
  @Output('budgetChanged') budgetChanged: EventEmitter<void> = new EventEmitter<void>();
  @Input('budget') budget!: IBudget;

  constructor(private budgetService: BudgetsService) {
  }

  get budgetRemaining(): number {
    return 100 - (this.budget.breakdown.need.planned + this.budget.breakdown.want.planned +  this.budget.breakdown.extra.planned)
  }

  save(): void {
    this.budgetService.saveBreakdown(this.budget).subscribe((res) => {
      this.budgetChanged.emit();
    })
  }

  checkActualVPlan(actual: number | undefined, plan: number): number {
    if(actual == undefined) return 0;
    return plan - actual;
  }
}
