import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategoryItemComponent } from './budget-category-item.component';

describe('BudgetCategoryItemComponent', () => {
  let component: BudgetCategoryItemComponent;
  let fixture: ComponentFixture<BudgetCategoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetCategoryItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCategoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
