/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AssignQuizzToSubtopicComponent } from './assign-quizz-to-subtopic.component';

describe('AssignQuizzToSubtopicComponent', () => {
  let component: AssignQuizzToSubtopicComponent;
  let fixture: ComponentFixture<AssignQuizzToSubtopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignQuizzToSubtopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignQuizzToSubtopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
