import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginGuard} from "./authentication/services/auth.service";
import {BillGuard} from "./services/bills.service";

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/analytics/analytics.module').then(m => m.AnalyticsModule), canActivate: [LoginGuard, BillGuard] },
  { path: 'payees', loadChildren: () => import('./modules/payees/payees.module').then(m => m.PayeesModule), canActivate: [LoginGuard, BillGuard] },
  { path: 'bills', loadChildren: () => import('./modules/bills/bills.module').then(m => m.BillsModule), canActivate: [LoginGuard, BillGuard] },
  { path: 'auth', loadChildren: () => import('./modules/authorization/authorization.module').then(m => m.AuthorizationModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
