import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginGuard} from "./authentication/services/auth.service";

const routes: Routes = [
  { path: 'bills', loadChildren: () => import('./modules/bills/bills.module').then(m => m.BillsModule), canActivate: [LoginGuard] },
  { path: 'auth', loadChildren: () => import('./modules/authorization/authorization.module').then(m => m.AuthorizationModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
