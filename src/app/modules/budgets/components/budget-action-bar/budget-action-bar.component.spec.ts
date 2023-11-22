import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetActionBarComponent } from './budget-action-bar.component';

describe('BudgetActionBarComponent', () => {
  let component: BudgetActionBarComponent;
  let fixture: ComponentFixture<BudgetActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetActionBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
