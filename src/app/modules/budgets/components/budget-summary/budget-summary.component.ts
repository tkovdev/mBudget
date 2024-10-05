import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBudget, IBudgetBreakdown} from "../../../../models/budget.model";
import {BudgetsService} from "../../../../services/budgets.service";
import {FormArray, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss']
})
export class BudgetSummaryComponent implements OnInit{
  @Input() fgBudget!: FormGroup;
  pendingSave: boolean = false;

  constructor(private budgetService: BudgetsService) {
  }

  ngOnInit(): void {
    this.fgBudget.controls['breakdown'].valueChanges.subscribe(() => {
      if(!this.pendingSave) this.pendingSave = true;
        setTimeout(() => {
          if(this.pendingSave) {
            this.save()
          }
        }, 1500)
    })
  }

  get budgetRemaining(): number {
    let breakdown: IBudgetBreakdown = this.fgBudget.get('breakdown')?.getRawValue()
    return 100 - (breakdown.need.planned + breakdown.want.planned +  breakdown.extra.planned)
  }

  save(): void {
    this.pendingSave = false;
    this.budgetService.saveBreakdown(this.fgBudget.getRawValue()).subscribe((res) => {
      this.fgBudget.markAsPristine()
      this.fgBudget.markAsUntouched()
    })
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
