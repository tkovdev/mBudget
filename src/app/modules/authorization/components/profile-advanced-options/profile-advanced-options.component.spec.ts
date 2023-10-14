import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAdvancedOptionsComponent } from './profile-advanced-options.component';

describe('ProfileAdvancedOptionsComponent', () => {
  let component: ProfileAdvancedOptionsComponent;
  let fixture: ComponentFixture<ProfileAdvancedOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileAdvancedOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAdvancedOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
