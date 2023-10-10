import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoriesComponent } from "./categories/categories.component";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { MainHomeComponent } from "./main-home/main-home.component";
import { TeacherRoutingModule } from "./teacher-routing.module";
import { ModuleCategoryComponent } from "./module-category/module-category.component";
import { SubjectComponent } from "./videos/subject/subject.component";
import { MainTeacherManagementComponent } from "./main-teacher-management.component";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@NgModule({
  declarations: [
    CategoriesComponent,
    MainHomeComponent,
    SubjectComponent,
    ModuleCategoryComponent,
    SubjectComponent,
    MainTeacherManagementComponent,
    HeaderComponent,
    SidebarComponent,
  ],
  imports: [SharedModule, FormsModule, CommonModule, TeacherRoutingModule],
  exports: [CategoriesComponent, MainHomeComponent, SubjectComponent],
})
export class MainTeacherManagementModule {}
