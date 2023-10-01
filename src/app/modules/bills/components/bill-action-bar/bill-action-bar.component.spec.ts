import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillActionBarComponent } from './bill-action-bar.component';

describe('BillActionBarComponent', () => {
  let component: BillActionBarComponent;
  let fixture: ComponentFixture<BillActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillActionBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
