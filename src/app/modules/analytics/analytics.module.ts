import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { NetMonthlyGraphComponent } from './components/net-monthly-graph/net-monthly-graph.component';
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";
import {SkeletonModule} from "primeng/skeleton";
import { YearOverYearSpendGraphComponent } from './components/year-over-year-spend-graph/year-over-year-spend-graph.component';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AnalyticsComponent,
    NetMonthlyGraphComponent,
    YearOverYearSpendGraphComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    ChartModule,
    SkeletonModule,

    CardModule,
    DropdownModule,
    FormsModule
  ]
})
export class AnalyticsModule { }
