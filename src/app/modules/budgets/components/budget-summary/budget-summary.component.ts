import {Component, Input} from '@angular/core';
import {IBudgetBreakdown} from "../../../../models/budget.model";

@Component({
  selector: 'app-budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss']
})
export class BudgetSummaryComponent {
  @Input('budgetBreakdown') budgetBreakdown!: IBudgetBreakdown;
}
