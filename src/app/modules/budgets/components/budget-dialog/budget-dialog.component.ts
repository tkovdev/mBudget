import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BudgetsService} from "../../../../services/budgets.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-budget-dialog',
  templateUrl: './budget-dialog.component.html',
  styleUrls: ['./budget-dialog.component.scss']
})
export class BudgetDialogComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  fgNewBudget: FormGroup = this.initBudgetForm();

  constructor(private router: Router, private budgetService: BudgetsService) {
  }


  initBudgetForm(): FormGroup {
    return new FormGroup({
      name: new FormControl({value: null, disabled: false}, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
    });
  }

  saveBudget(): void {
    this.budgetService.addBudget(this.fgNewBudget.get('name')?.value).subscribe((res) => {
      this.router.navigate([], {queryParams: {name: this.fgNewBudget.get('name')?.value}})
      this.fgNewBudget = this.initBudgetForm();
      this.close.emit();
    });
  }
}
