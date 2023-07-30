import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAlertComponent } from './email-alert.component';

describe('EmailAlertComponent', () => {
  let component: EmailAlertComponent;
  let fixture: ComponentFixture<EmailAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailAlertComponent]
    });
    fixture = TestBed.createComponent(EmailAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
