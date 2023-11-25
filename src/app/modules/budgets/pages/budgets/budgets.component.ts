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

  budget!: IBudget;

  constructor(private router: Router, private route: ActivatedRoute, private budgetService: BudgetsService) {
    this.loadNames();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if(params.has('budget')){
        this.selectedBudget = params.get('budget')!;
        this.loadBudget();
      }
    });
    this.loadBudget();
  }

  loadNames(): void {
    this.budgetService.getBudgetNames().subscribe((res) => {
      this.budgets = res;
      this.selectedBudget = this.budgets[0];
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
    this.loadBudget();
  }

  budgetDeleted(name: string): void {
    this.budgetService.deleteBudget(name).subscribe((res) => {
      this.loadNames();
      this.router.navigate(['', 'budgets']);
    })
  }
}
