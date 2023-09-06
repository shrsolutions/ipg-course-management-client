import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CategoriesComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    CommonModule
  ],
  exports:[
    CategoriesComponent
  ]
})
export class MainTeacherManagementModule { }
