import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AnalyticsService} from "../../../../services/analytics.service";
import {BillsService} from "../../../../services/bills.service";
import {FilesService} from "../../../../services/files.service";
import {SharedService} from "../../../../services/shared.service";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit{

  budgets: string[] = ['Primary', 'What If'];

  selectedBudget: string = 'Primary'

  constructor(private router: Router, private route: ActivatedRoute) {
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
