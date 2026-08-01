import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyBillsComponent } from './yearly-bills.component';

describe('YearlyBillsComponent', () => {
  let component: YearlyBillsComponent;
  let fixture: ComponentFixture<YearlyBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearlyBillsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(YearlyBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});