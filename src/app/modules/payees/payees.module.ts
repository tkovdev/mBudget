import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayeesRoutingModule } from './payees-routing.module';
import { PayeesComponent } from './pages/payees/payees.component';
import { PayeeListComponent } from './components/payee-list/payee-list.component';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {PayeeActionBarComponent} from "./components/payee-action-bar/payee-action-bar.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {PayeeDialogComponent} from "./components/payee-dialog/payee-dialog.component";
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {TooltipModule} from "primeng/tooltip";


@NgModule({
  declarations: [
    PayeesComponent,
    PayeeListComponent,
    PayeeActionBarComponent,
    PayeeDialogComponent
  ],
    imports: [
        CommonModule,
        PayeesRoutingModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        OverlayPanelModule,
        InputTextModule,
        TooltipModule
    ]
})
export class PayeesModule { }
