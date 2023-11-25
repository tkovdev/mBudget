import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AnalyticsService} from "../../../../services/analytics.service";
import {BillsService} from "../../../../services/bills.service";
import {FilesService} from "../../../../services/files.service";
import {SharedService} from "../../../../services/shared.service";
import {IBudget, IBudgetBreakdown} from "../../../../models/budget.model";
import {BudgetsService} from "../../../../services/budgets.service";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit{

  budgets: string[] = [];

  selectedBudget!: string;

  budgetBreakdown!: IBudgetBreakdown;
  budget!: IBudget;

  constructor(private router: Router, private route: ActivatedRoute, private budgetService: BudgetsService) {
    this.budgetBreakdown = {
      need: {actual: 0, planned: 0, salaryTotal: 0, monthlyTotal: 0},
      want: {actual: 0, planned: 0, salaryTotal: 0, monthlyTotal: 0},
      extra: {actual: 0, planned: 0, salaryTotal: 0, monthlyTotal: 0}
    }
    this.loadNames();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if(params.has('budget')){
        this.selectedBudget = params.get('budget')!;
        this.loadBreakdown();
        this.loadBudget();
      }
    });
    this.loadBreakdown();
    this.loadBudget();
  }

  loadNames(): void {
    this.budgetService.getBudgetNames().subscribe((res) => {
      this.budgets = res;
      this.selectedBudget = this.budgets[0];
    });
  }

  loadBreakdown(): void {
    this.budgetService.getBudgetBreakdown(this.selectedBudget).subscribe((res) => {
      if(res) this.budgetBreakdown = res;
    });
  }

  loadBudget(): void {
    this.budgetService.getBudget(this.selectedBudget).subscribe((res) => {
      if(res != undefined) this.budget = res;
    });
  }

  budgetSelected(budget: string | undefined): void {
    this.router.navigate(['', 'budgets', budget]);
  }

  budgetChanged(): void {
    this.loadNames();
    this.loadBreakdown();
    this.loadBudget();
  }

  budgetDeleted(name: string): void {
    this.budgetService.deleteBudget(name).subscribe((res) => {
      this.loadNames();
      this.router.navigate(['', 'budgets']);
    })
  }
}
