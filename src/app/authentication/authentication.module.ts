import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedirectComponent } from './components/redirect/redirect.component';



@NgModule({
  declarations: [
    RedirectComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [RedirectComponent]
})
export class AuthenticationModule { }
