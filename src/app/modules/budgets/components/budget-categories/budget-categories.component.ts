import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BudgetsService} from "../../../../services/budgets.service";
import {ControlContainer, FormArray, FormArrayName, FormGroup, FormGroupDirective} from "@angular/forms";
import {OverlayPanel} from "primeng/overlaypanel";

@Component({
  selector: 'app-budget-categories',
  templateUrl: './budget-categories.component.html',
  styleUrls: ['./budget-categories.component.scss']
})
export class BudgetCategoriesComponent implements OnInit{
  fgCategory!: FormArray;
  formArrayName!: string;

  @ViewChild('budgetItemPanel') budgetItemPanel!: OverlayPanel;

  constructor(private budgetService: BudgetsService, private fg: FormArrayName, private fgDir: FormGroupDirective) {
  }

  ngOnInit(): void {
    this.fgCategory = this.fg.control
    this.fgCategory.setParent(this.fgDir.form)
    this.formArrayName = this.fg.name as string;
  }

  deleteItem(index: number): void {
    this.budgetService.removeBudgetItem(this.fgParent.get('name')?.getRawValue(), this.formArrayName, index).subscribe((res) => {
      this.fgCategory.removeAt(index);
    });
  }

  save(): void {
    this.budgetService.updateBudgetItems(this.fgParent.get('name')?.getRawValue(), this.formArrayName, this.fgCategory.getRawValue()).subscribe((res) => {
      this.fgCategory.markAsPristine()
      this.fgCategory.markAsUntouched()
    });
  }

  get fgParent(): FormGroup {
    return this.fgDir.form as FormGroup;
  }

  get categoryFormGroups(): FormGroup[] {
    return this.fgCategory.controls as FormGroup[]
  }
}
