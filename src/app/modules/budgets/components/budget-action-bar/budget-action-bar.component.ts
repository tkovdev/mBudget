import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBudget} from "../../../../models/budget.model";
import {FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-budget-action-bar',
  templateUrl: './budget-action-bar.component.html',
  styleUrls: ['./budget-action-bar.component.scss']
})
export class BudgetActionBarComponent implements OnInit{
  @Input('budgets') budgets: string[] = [];
  @Input() fgBudget!: FormGroup;

  budgetDialog: boolean = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.fgBudget.get('name')?.valueChanges.subscribe(() => {
      if(this.fgBudget.get('name')?.dirty) this.router.navigate([], {queryParams: {name: this.fgBudget.get('name')?.value}})
    });
  }

  deleteBudget(): void {
    // this.budgetDeleted.emit(name);
  }

  get remaining(): number {
    let need = this.need.get('monthlyTotal')?.value
    let want = this.want.get('monthlyTotal')?.value
    let extra = this.extra.get('monthlyTotal')?.value
    let net = this.income.get('net')?.value
    return (net - (need + want + extra));
  }

  get breakdown(): FormGroup {
    return this.fgBudget.get('breakdown') as FormGroup;
  }

  get need(): FormGroup {
    return this.breakdown.get('need') as FormGroup;
  }
  get want(): FormGroup {
    return this.breakdown.get('want') as FormGroup;
  }
  get extra(): FormGroup {
    return this.breakdown.get('extra') as FormGroup;
  }

  get income(): FormGroup {
    return this.fgBudget.get('income') as FormGroup
  }
}
