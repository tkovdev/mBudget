import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './pages/reports/reports.component';
import { ReportCallToActionComponent } from './components/report-call-to-action/report-call-to-action.component';
import { YearlyBillsComponent } from './components/yearly-bills/yearly-bills.component';

@NgModule({
  declarations: [
    ReportsComponent,
    ReportCallToActionComponent,
    YearlyBillsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    CardModule,
    ButtonModule,
    CheckboxModule,
    SelectModule
  ]
})
export class ReportsModule { }