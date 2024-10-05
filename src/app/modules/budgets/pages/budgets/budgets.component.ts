import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AnalyticsService} from "../../../../services/analytics.service";
import {BillsService} from "../../../../services/bills.service";
import {FilesService} from "../../../../services/files.service";
import {SharedService} from "../../../../services/shared.service";
import {IBudget, IBudgetBreakdown, IBudgetBreakdownItem, IBudgetItem} from "../../../../models/budget.model";
import {BudgetsService} from "../../../../services/budgets.service";
import {FormArray, FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit{
  fgBudget!: FormGroup;

  budgets: string[] = [];

  selectedBudget!: string;

  budget!: IBudget;

  constructor(private router: Router, private route: ActivatedRoute, private budgetService: BudgetsService) {}

  ngOnInit(): void {
    this.loadNames();
    this.fgBudget = this.initBudgetFormGroup();

    this.route.paramMap.subscribe((params) => {
      if(params.has('budget')){
        this.selectedBudget = params.get('budget')!;
        this.loadBudget();
      }
    });
    this.budgetService.getBudget(this.selectedBudget).subscribe((res) => {
      if(res) {
        this.fgBudget.controls['need'] = this.initBudgetItemFormArray(res.need.length)
        this.fgBudget.controls['want'] = this.initBudgetItemFormArray(res.want.length)
        this.fgBudget.controls['extra'] = this.initBudgetItemFormArray(res.extra.length)
        this.fgBudget.patchValue(res);
      }
    });
  }

  initBudgetFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl({value: null, disabled: false}),
      breakdown: this.initBudgetBreakdownFormGroup(),
      income: new FormGroup({
        net: new FormControl({value: null, disabled: false}),
        gross: new FormControl({value: null, disabled: false}),
      }),
      debt: new FormControl({value: null, disabled: false}),
      need: this.initBudgetItemFormArray(),
      want: this.initBudgetItemFormArray(),
      extra: this.initBudgetItemFormArray()
    })
  }

  initBudgetBreakdownFormGroup(): FormGroup {
    return new FormGroup({
      need: this.initBudgetBreakdownItemFormGroup(),
      want: this.initBudgetBreakdownItemFormGroup(),
      extra: this.initBudgetBreakdownItemFormGroup()
    })
  }

  initBudgetBreakdownItemFormGroup(): FormGroup {
    return new FormGroup({
        planned: new FormControl({value: null, disabled: false}),
        actual : new FormControl({value: null, disabled: false}),
        salaryTotal : new FormControl({value: null, disabled: false}),
        monthlyTotal : new FormControl({value: null, disabled: false})
    });
  }

  initBudgetItemFormArray(count: number = 0): FormArray {
    let arr = new FormArray<FormGroup>([]);
    for(let i = 0; i < count; i++) arr.push(this.initBudgetItemFormGroup())
    return arr;
  }

  initBudgetItemFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl({value: null, disabled: false},{validators: [Validators.required, Validators.minLength(3), Validators.maxLength(16)]}),
      amount: new FormControl({value: null, disabled: false},{ validators: [Validators.required]}),
    }, {updateOn: 'blur'});
  }


  loadNames(): void {
    this.budgetService.getBudgetNames().subscribe((res) => {
      this.budgets = res;
      if(this.selectedBudget == undefined) this.selectedBudget = this.budgets[0];
    });
  }

  loadBudget(): void {
    this.budgetService.getBudget(this.selectedBudget).subscribe((res) => {
      if(res != undefined) this.budget = res;
    });
  }

  budgetSelected(budget: string | undefined): void {
    this.router.navigate(['', 'budgets', budget]);
  }

  budgetChanged(): void {
    this.loadNames();
    this.loadBudget();
  }

  budgetDeleted(name: string): void {
    this.budgetService.deleteBudget(name).subscribe((res) => {
      this.loadNames();
      this.router.navigate(['', 'budgets']);
    })
  }
}
