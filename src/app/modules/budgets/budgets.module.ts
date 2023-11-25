import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsRoutingModule } from './budgets-routing.module';
import { BudgetsComponent } from './pages/budgets/budgets.component';
import { BudgetActionBarComponent } from './components/budget-action-bar/budget-action-bar.component';
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {TooltipModule} from "primeng/tooltip";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BudgetDialogComponent } from './components/budget-dialog/budget-dialog.component';
import { BudgetSummaryComponent } from './components/budget-summary/budget-summary.component';
import {InputNumberModule} from "primeng/inputnumber";
import { BudgetIncomeDebtComponent } from './components/budget-income-debt/budget-income-debt.component';
import {MessageModule} from "primeng/message";

@NgModule({
  declarations: [
    BudgetsComponent,
    BudgetActionBarComponent,
    BudgetDialogComponent,
    BudgetSummaryComponent,
    BudgetIncomeDebtComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BudgetsRoutingModule,
    CardModule,
    ButtonModule,
    OverlayPanelModule,
    InputTextModule,
    TooltipModule,
    DropdownModule,
    ReactiveFormsModule,
    InputNumberModule,
    MessageModule
  ]
})
export class BudgetsModule { }
