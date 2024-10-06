import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBudget} from "../../../../models/budget.model";
import {BudgetsService} from "../../../../services/budgets.service";
import {FormArray, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-budget-income-debt',
  templateUrl: './budget-income-debt.component.html',
  styleUrls: ['./budget-income-debt.component.scss']
})
export class BudgetIncomeDebtComponent implements OnInit{
  @Input() fgBudget!: FormGroup;

  constructor(private budgetService: BudgetsService) {
  }

  ngOnInit(): void {
    this.fgBudget.get('income')?.valueChanges.subscribe(() => {
      this.save();
    });
    this.fgBudget.get('debt')?.valueChanges.subscribe(() => {
      this.save();
    });
  }

  get incomeHourlyNet(): number {
    return this.fgBudget.get('income')?.get('net')?.value / 4 / 40 | 0;
  }

  get incomeSalaryNet(): number {
    return this.fgBudget.get('income')?.get('net')?.value * 12 | 0;
  }

  get incomeHourlyGross(): number {
    return this.fgBudget.get('income')?.get('gross')?.value / 4 / 40 | 0;
  }

  get incomeSalaryGross(): number {
    return this.fgBudget.get('income')?.get('gross')?.value * 12 | 0;
  }

  get debtToIncome(): number {
    if(this.incomeSalaryGross == 0) return 0;
    return this.fgBudget.get('debt')?.value / (this.incomeSalaryGross/12) * 100;
  }

  save(): void {
    this.budgetService.saveDebtToIncome(this.fgBudget.getRawValue()).subscribe((res) => {
    })
  }
}
