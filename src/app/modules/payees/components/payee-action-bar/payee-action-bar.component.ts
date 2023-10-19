import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IBill, IPayee} from "../../../../models/bill.model";
import {Observable} from "rxjs";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-payee-action-bar',
  templateUrl: './payee-action-bar.component.html',
  styleUrls: ['./payee-action-bar.component.scss']
})
export class PayeeActionBarComponent {
  @Output() payeeChanged: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  payeeChangedEvent(): void {
    this.payeeChanged.emit();
  }
}
