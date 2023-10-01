import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPayDialogComponent } from './bill-pay-dialog.component';

describe('BillAddDialogComponent', () => {
  let component: BillPayDialogComponent;
  let fixture: ComponentFixture<BillPayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillPayDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillPayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
