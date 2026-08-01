import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCallToActionComponent } from './report-call-to-action.component';

describe('ReportCallToActionComponent', () => {
  let component: ReportCallToActionComponent;
  let fixture: ComponentFixture<ReportCallToActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportCallToActionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportCallToActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});