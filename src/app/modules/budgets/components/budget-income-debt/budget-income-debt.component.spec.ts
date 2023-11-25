import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetIncomeDebtComponent } from './budget-income-debt.component';

describe('BudgetIncomeDebtComponent', () => {
  let component: BudgetIncomeDebtComponent;
  let fixture: ComponentFixture<BudgetIncomeDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetIncomeDebtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetIncomeDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
