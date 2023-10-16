import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetMonthlyGraphComponent } from './net-monthly-graph.component';

describe('NetMonthlyGraphComponent', () => {
  let component: NetMonthlyGraphComponent;
  let fixture: ComponentFixture<NetMonthlyGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetMonthlyGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetMonthlyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
