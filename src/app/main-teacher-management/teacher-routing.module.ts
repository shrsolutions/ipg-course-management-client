import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MainHomeComponent } from "./main-home/main-home.component";
import { ModuleCategoryComponent } from "./module-category/module-category.component";
import { MainTeacherManagementComponent } from "./main-teacher-management.component";
import { RoleComponent } from "./admin/role/role.component";
import { UserAcivateComponent } from "./admin/user-acivate/user-acivate.component";
import { UserRegisteredComponent } from "./account/user-registered/user-registered.component";
import { CategoryComponent } from "./admin/category/category.component";
import { SubjectsComponent } from "./admin/subjects/subjects.component";
import { TopicComponent } from "./teacher-module/topic/topic.component";
import { TopicFormComponent } from "./teacher-module/topic/topic-form/topic-form.component";
import { SubjectVideosComponent } from "./teacher-module/videos/subject-videos/subject-videos.component";
import { TopicVideosComponent } from "./teacher-module/videos/topic-videos/topic-videos.component";
import { SubtopicVideosComponent } from "./teacher-module/videos/subtopic-videos/subtopic-videos.component";
import { VideoFormComponent } from "./teacher-module/videos/video-form/video-form.component";

const userRoutes: Routes = [
  {
    path: "main-teacher-management",
    component: MainTeacherManagementComponent,
    children: [
      { path: "module-category", component: ModuleCategoryComponent },
      { path: "main-home", component: MainHomeComponent },
      { path: "admin/role", component: RoleComponent },
      { path: "admin/user-activate", component: UserAcivateComponent },
      { path: "admin/category", component: CategoryComponent },
      { path: "admin/subject", component: SubjectsComponent },
      { path: "teacher-module/topics", component: TopicComponent },
      {
        path: "teacher-module/videos/subject",
        component: SubjectVideosComponent,
      },
      {
        path: "teacher-module/videos/topic/:id",
        component: TopicVideosComponent,
      },
      {
        path: "teacher-module/videos/subtopic/:id",
        component: SubtopicVideosComponent,
      },
      {
        path: "teacher-module/videos/video-form/:id",
        component: VideoFormComponent,
      },
      {
        path: "teacher-module/topics/topic-form/:id",
        component: TopicFormComponent,
      },
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
