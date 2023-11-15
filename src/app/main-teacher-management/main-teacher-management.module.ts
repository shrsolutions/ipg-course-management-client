import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { MainHomeComponent } from "./main-home/main-home.component";
import { TeacherRoutingModule } from "./teacher-routing.module";
import { ModuleCategoryComponent } from "./module-category/module-category.component";
import { MainTeacherManagementComponent } from "./main-teacher-management.component";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RoleComponent } from "./admin/role/role.component";
import { UserAcivateComponent } from "./admin/user-acivate/user-acivate.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { SetNewRoleComponent } from "./admin/user-acivate/set-new-role/set-new-role.component";
import { UserRegisteredComponent } from "./account/user-registered/user-registered.component";
import { CategoryComponent } from "./admin/category/category.component";
import { SubjectsComponent } from "./admin/subjects/subjects.component";
import { TopicComponent } from "./teacher-module/topic/topic.component";
import { SubjectListComponent } from "./admin/subjects/subject-list/subject-list.component";
@NgModule({
  declarations: [
    MainHomeComponent,
    ModuleCategoryComponent,
    MainTeacherManagementComponent,
    HeaderComponent,
    SidebarComponent,
    RoleComponent,
    UserAcivateComponent,
    SetNewRoleComponent,
    UserRegisteredComponent,
    CategoryComponent,
    SubjectsComponent,
    TopicComponent,
    SubjectListComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    CommonModule,
    TeacherRoutingModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  exports: [MainHomeComponent],
})
export class MainTeacherManagementModule {}
