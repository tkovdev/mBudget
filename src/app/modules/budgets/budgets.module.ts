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


@NgModule({
  declarations: [
    BudgetsComponent,
    BudgetActionBarComponent,
    BudgetDialogComponent,
    BudgetSummaryComponent
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
    InputNumberModule
  ]
})
export class BudgetsModule { }
