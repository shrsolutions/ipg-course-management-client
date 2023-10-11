import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTeacherManagementComponent } from './main-teacher-management.component';

describe('MainTeacherManagementComponent', () => {
  let component: MainTeacherManagementComponent;
  let fixture: ComponentFixture<MainTeacherManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainTeacherManagementComponent]
    });
    fixture = TestBed.createComponent(MainTeacherManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
