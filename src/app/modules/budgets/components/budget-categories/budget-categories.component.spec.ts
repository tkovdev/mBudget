import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategoriesComponent } from './budget-categories.component';

describe('BudgetCategoriesComponent', () => {
  let component: BudgetCategoriesComponent;
  let fixture: ComponentFixture<BudgetCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
