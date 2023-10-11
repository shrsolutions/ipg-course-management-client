import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MainHomeComponent } from "./main-home/main-home.component";
import { ModuleCategoryComponent } from "./module-category/module-category.component";
import { SubjectComponent } from "./videos/subject/subject.component";
import { MainTeacherManagementComponent } from "./main-teacher-management.component";

const userRoutes: Routes = [
  {
    path: "main-teacher-management",
    component: MainTeacherManagementComponent,
    children: [
      { path: "module-category", component: ModuleCategoryComponent },
      { path: "main-home", component: MainHomeComponent },
      { path: "videos/subject", component: SubjectComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, [RouterModule.forChild(userRoutes)]],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
