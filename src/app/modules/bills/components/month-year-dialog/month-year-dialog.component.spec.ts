import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthYearDialogComponent } from './month-year-dialog.component';

describe('MonthYearDialogComponent', () => {
  let component: MonthYearDialogComponent;
  let fixture: ComponentFixture<MonthYearDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthYearDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthYearDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
