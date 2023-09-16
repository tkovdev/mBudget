import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillsRoutingModule } from './bills-routing.module';
import { BillsComponent } from './pages/bills/bills.component';
import { BillSummaryComponent } from './components/bill-summary/bill-summary.component';
import { CardModule } from 'primeng/card';
import { PaidPipe } from './pipes/paid.pipe';

@NgModule({
  declarations: [
    BillsComponent,
    BillSummaryComponent,
    PaidPipe
  ],
  imports: [
    CommonModule,
    BillsRoutingModule,
    CardModule
  ]
})
export class BillsModule { }
