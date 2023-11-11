import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MainHomeComponent } from "./main-home/main-home.component";
import { ModuleCategoryComponent } from "./module-category/module-category.component";
import { SubjectComponent } from "./videos/subject/subject.component";
import { MainTeacherManagementComponent } from "./main-teacher-management.component";
import { RoleComponent } from "./admin/role/role.component";
import { UserAcivateComponent } from "./admin/user-acivate/user-acivate.component";
import { UserRegisteredComponent } from "./account/user-registered/user-registered.component";

const userRoutes: Routes = [
  {
    path: "main-teacher-management",
    component: MainTeacherManagementComponent,
    children: [
      { path: "module-category", component: ModuleCategoryComponent },
      { path: "main-home", component: MainHomeComponent },
      { path: "videos/subject", component: SubjectComponent },
      { path: "admin/role", component: RoleComponent },
      { path: "admin/user-activate", component: UserAcivateComponent },
      { path: "account/user-registered", component: UserRegisteredComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, [RouterModule.forChild(userRoutes)]],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
