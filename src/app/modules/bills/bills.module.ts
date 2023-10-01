import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillsRoutingModule } from './bills-routing.module';
import { BillsComponent } from './pages/bills/bills.component';
import { BillSummaryComponent } from './components/bill-summary/bill-summary.component';
import { CardModule } from 'primeng/card';
import { PaidPipe } from './pipes/paid.pipe';
import { BillActionBarComponent } from './components/bill-action-bar/bill-action-bar.component';
import {BillPayDialogComponent} from "./components/bill-pay-dialog/bill-pay-dialog.component";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {DialogService, DynamicDialogModule} from "primeng/dynamicdialog";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {TooltipModule} from "primeng/tooltip";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import { PayeeDialogComponent } from './components/payee-dialog/payee-dialog.component';

@NgModule({
  declarations: [
    BillsComponent,
    BillSummaryComponent,
    PaidPipe,
    BillActionBarComponent,
    BillPayDialogComponent,
    PayeeDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BillsRoutingModule,
    CardModule,
    DropdownModule,
    ButtonModule,
    DynamicDialogModule,
    OverlayPanelModule,
    InputTextModule,
    TooltipModule,
    InputNumberModule
  ],
  providers: [DialogService]
})
export class BillsModule { }
