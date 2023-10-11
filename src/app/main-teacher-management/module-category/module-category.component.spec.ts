import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleCategoryComponent } from './module-category.component';

describe('ModuleCategoryComponent', () => {
  let component: ModuleCategoryComponent;
  let fixture: ComponentFixture<ModuleCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModuleCategoryComponent]
    });
    fixture = TestBed.createComponent(ModuleCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
