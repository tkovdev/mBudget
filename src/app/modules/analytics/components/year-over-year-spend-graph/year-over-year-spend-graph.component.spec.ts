import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearOverYearSpendGraphComponent } from './year-over-year-spend-graph.component';

describe('YearOverYearSpendGraphComponent', () => {
  let component: YearOverYearSpendGraphComponent;
  let fixture: ComponentFixture<YearOverYearSpendGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearOverYearSpendGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearOverYearSpendGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
