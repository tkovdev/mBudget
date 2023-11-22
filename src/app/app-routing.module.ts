import {inject, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import {LoginGuard} from "./authentication/services/auth.service";
import {BillFileGuard} from "./services/bills.service";

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/analytics/analytics.module').then(m => m.AnalyticsModule), canActivate: [LoginGuard, BillFileGuard] },
  { path: 'payees', loadChildren: () => import('./modules/payees/payees.module').then(m => m.PayeesModule), canActivate: [LoginGuard, BillFileGuard] },
  { path: 'bills', loadChildren: () => import('./modules/bills/bills.module').then(m => m.BillsModule), canActivate: [LoginGuard, BillFileGuard] },
  { path: 'budgets', loadChildren: () => import('./modules/budgets/budgets.module').then(m => m.BudgetsModule), canActivate: [LoginGuard] },
  { path: 'auth', loadChildren: () => import('./modules/authorization/authorization.module').then(m => m.AuthorizationModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
