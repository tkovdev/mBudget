import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AnalyticsService} from "../../../../services/analytics.service";
import {BillsService} from "../../../../services/bills.service";
import {FilesService} from "../../../../services/files.service";
import {SharedService} from "../../../../services/shared.service";
import {IBudgetBreakdown} from "../../../../models/budget.model";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit{

  budgets: string[] = ['Primary', 'What If'];

  selectedBudget: string = 'Primary';

  budgetBreakdown!: IBudgetBreakdown;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.budgetBreakdown = {
      need: {actual: 0, planned: 0, salaryTotal: 0, monthlyTotal: 0},
      want: {actual: 0, planned: 0, salaryTotal: 0, monthlyTotal: 0},
      extra: {actual: 0, planned: 0, salaryTotal: 0, monthlyTotal: 0}
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if(params.has('budget')){
        this.selectedBudget = params.get('budget')!;
      }
    });
  }

  budgetSelected(budget: string): void {
    this.router.navigate(['', 'budgets', budget]);
  }
}
