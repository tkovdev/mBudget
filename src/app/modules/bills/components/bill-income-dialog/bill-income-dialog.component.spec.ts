import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillIncomeDialogComponent } from './bill-income-dialog.component';

describe('BillIncomeDialogComponent', () => {
  let component: BillIncomeDialogComponent;
  let fixture: ComponentFixture<BillIncomeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillIncomeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillIncomeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
