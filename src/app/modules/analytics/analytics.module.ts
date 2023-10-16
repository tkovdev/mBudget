import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { NetMonthlyGraphComponent } from './components/net-monthly-graph/net-monthly-graph.component';
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";
import {SkeletonModule} from "primeng/skeleton";


@NgModule({
  declarations: [
    AnalyticsComponent,
    NetMonthlyGraphComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    ChartModule,
    SkeletonModule,

    CardModule
  ]
})
export class AnalyticsModule { }
