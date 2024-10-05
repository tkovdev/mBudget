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
import { BudgetCategoriesComponent } from './components/budget-categories/budget-categories.component';
import {AccordionModule} from "primeng/accordion";
import { BudgetCategoryItemComponent } from './components/budget-category-item/budget-category-item.component';

@NgModule({
  declarations: [
    BudgetsComponent,
    BudgetActionBarComponent,
    BudgetDialogComponent,
    BudgetSummaryComponent,
    BudgetIncomeDebtComponent,
    BudgetCategoriesComponent,
    BudgetCategoryItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BudgetsRoutingModule,
    CardModule,
    ButtonModule,
    OverlayPanelModule,
    InputTextModule,
    TooltipModule,
    DropdownModule,
    ReactiveFormsModule,
    InputNumberModule,
    MessageModule,
    AccordionModule
  ]
})
export class BudgetsModule { }
