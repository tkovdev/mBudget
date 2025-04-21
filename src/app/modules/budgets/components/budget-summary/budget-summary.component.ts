import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBudget, IBudgetBreakdown} from "../../../../models/budget.model";
import {BudgetsService} from "../../../../services/budgets.service";
import {FormArray, FormGroup, FormGroupDirective} from "@angular/forms";

@Component({
  selector: 'app-budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss']
})
export class BudgetSummaryComponent implements OnInit{
  fgBudget!: FormGroup;
  constructor(private budgetService: BudgetsService, private fg: FormGroupDirective) {
  }

  ngOnInit(): void {
    this.fgBudget = this.fg.form
    this.need.get('planned')?.valueChanges.subscribe(() => {
      this.save();
    });
    this.want.get('planned')?.valueChanges.subscribe(() => {
      this.save();
    });
    this.extra.get('planned')?.valueChanges.subscribe(() => {
      this.save();
    });

    this.fgBudget.get('need')?.valueChanges.subscribe(() => {
      let needTotal = (this.fgBudget.get('need') as FormArray).controls.map((x) => x.get('amount')?.value).reduce((total, currentValue) => total + currentValue, 0);
      this.need.get('monthlyTotal')?.patchValue(needTotal)
    });

    this.fgBudget.get('want')?.valueChanges.subscribe(() => {
      let total = (this.fgBudget.get('want') as FormArray).controls.map((x) => x.get('amount')?.value).reduce((total, currentValue) => total + currentValue, 0);
      this.want.get('monthlyTotal')?.patchValue(total)
    });

    this.fgBudget.get('extra')?.valueChanges.subscribe(() => {
      let total = (this.fgBudget.get('extra') as FormArray).controls.map((x) => x.get('amount')?.value).reduce((total, currentValue) => total + currentValue, 0);
      this.extra.get('monthlyTotal')?.patchValue(total)
    });
  }

  get budgetRemaining(): number {
    let breakdown: IBudgetBreakdown = this.fgBudget.get('breakdown')?.getRawValue()
    return 100 - (breakdown.need.planned + breakdown.want.planned +  breakdown.extra.planned)
  }

  save(): void {
    this.budgetService.saveBreakdown(this.fgBudget.getRawValue()).subscribe((res) => {
      this.fgBudget.markAsPristine()
      this.fgBudget.markAsUntouched()
    });
  }

  get breakdown(): FormGroup {
    return this.fgBudget.get('breakdown') as FormGroup
  }

  get need(): FormGroup {
    return this.breakdown.get('need') as FormGroup
  }

  get want(): FormGroup {
    return this.breakdown.get('want') as FormGroup
  }

  get extra(): FormGroup {
    return this.breakdown.get('extra') as FormGroup
  }
}
