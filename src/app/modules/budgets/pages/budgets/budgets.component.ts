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

  constructor(private router: Router, private route: ActivatedRoute, private budgetService: BudgetsService) {}

  ngOnInit(): void {
    this.fgBudget = this.initBudgetFormGroup();
    this.loadNames();

    this.route.queryParamMap.subscribe((params) => {
      if(params.has('name')){
        this.fgBudget.controls['name'].patchValue(params.get('name'))
        this.loadBudget();
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
      }, {updateOn: 'blur'}),
      debt: new FormControl({value: null, disabled: false}, {updateOn: 'blur'}),
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
    }, {updateOn:'blur'})
  }

  initBudgetBreakdownItemFormGroup(): FormGroup {
    return new FormGroup({
        planned: new FormControl({value: null, disabled: false}),
        actual : new FormControl({value: null, disabled: true}),
        salaryTotal : new FormControl({value: null, disabled: true}),
        monthlyTotal : new FormControl({value: null, disabled: true})
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
      if(res && res[0]) this.router.navigate([], {queryParams: {name: res[0]}})
    });
  }

  loadBudget(): void {
    this.budgetService.getBudget(this.fgBudget.get('name')?.value).subscribe((res) => {
      if(res) {
        this.fgBudget.controls['need'] = this.initBudgetItemFormArray(res.need.length)
        this.fgBudget.controls['want'] = this.initBudgetItemFormArray(res.want.length)
        this.fgBudget.controls['extra'] = this.initBudgetItemFormArray(res.extra.length)
        this.fgBudget.patchValue(res, {emitEvent: false});
      }
    });
  }

  budgetDeleted(name: string): void {
    this.budgetService.deleteBudget(name).subscribe((res) => {
      this.loadNames();
      this.router.navigate(['', 'budgets']);
    })
  }
}
