import {FormArray, FormGroup} from '@angular/forms';
import {of} from 'rxjs';

import {BudgetsComponent} from './budgets.component';

describe('BudgetsComponent', () => {
  let component: BudgetsComponent;

  beforeEach(() => {
    component = new BudgetsComponent(
      { navigate: jasmine.createSpy('navigate') } as any,
      {
        snapshot: { queryParamMap: { has: () => false } },
        queryParamMap: of({ has: () => false, get: () => null })
      } as any,
      {
        getBudgetNames: () => of([]),
        getBudget: () => of(null),
        deleteBudget: () => of(null)
      } as any
    );

    component.fgBudget = component.initBudgetFormGroup();
  });

  it('should create the budget form', () => {
    expect(component.fgBudget).toBeTruthy();
  });

  it('should total the need category amounts', () => {
    const need = component.fgBudget.get('need') as FormArray<FormGroup>;

    need.push(component.initBudgetItemFormGroup());
    need.push(component.initBudgetItemFormGroup());
    need.at(0).patchValue({ name: 'Rent', amount: 1200 });
    need.at(1).patchValue({ name: 'Utilities', amount: 150.5 });

    expect(component.getCategorySubtotal('need')).toBe(1350.5);
  });

  it('should treat empty and missing amounts as zero in category totals', () => {
    const want = component.fgBudget.get('want') as FormArray<FormGroup>;

    want.push(component.initBudgetItemFormGroup());
    want.push(component.initBudgetItemFormGroup());
    want.at(0).patchValue({ name: 'Dining', amount: null });
    want.at(1).patchValue({ name: 'Streaming', amount: 25 });

    expect(component.getCategorySubtotal('want')).toBe(25);
  });
});
