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
import { GroupComponent } from "./teacher-module/group/group.component";
import { LanguagesComponent } from "./admin/languages/languages.component";
import { StudentComponent } from "./admin/student/student.component";
import { QuizzesComponent } from "./teacher-module/quizzes/quizzes.component";
import { NewQuizComponent } from "./teacher-module/quizzes/new-quiz/new-quiz.component";

const userRoutes: Routes = [
  {
    path: "main-teacher-management",
    component: MainTeacherManagementComponent,
    data: { breadcrumb: "Main" },
    children: [
      {
        path: "module-category",
        component: ModuleCategoryComponent,
        data: { breadcrumb: "Home" },
      },
      {
        path: "main-home",
        component: MainHomeComponent,
        data: { breadcrumb: "Categories" },
      },
      {
        path: "admin/role",
        component: RoleComponent,
        data: { breadcrumb: "Role" },
      },
      {
        path: "admin/language",
        component: LanguagesComponent,
        data: { breadcrumb: "Language" },
      },
      {
        path: "admin/user-activate",
        component: UserAcivateComponent,
        data: { breadcrumb: "User Activated" },
      },
      {
        path: "admin/student",
        component: StudentComponent,
        data: { breadcrumb: "Student" },
      },
      {
        path: "admin/category",
        component: CategoryComponent,
        data: { breadcrumb: "New Category" },
      },
      {
        path: "admin/subject",
        component: SubjectsComponent,
        data: { breadcrumb: "New Subject" },
      },
    
      {
        path: "teacher-module/topics",
        component: TopicComponent,
        data: { breadcrumb: "subject-topic-list" },
      },
      {
        path: "teacher-module/quizzes",
        component: QuizzesComponent,
      },

      {
        path: "teacher-module/quizzes/quizz",
        component: NewQuizComponent,
      },

      {
        path: "teacher-module/quizzes/quizz/:id",
        component: NewQuizComponent,
      },

      {
        path: "teacher-module/videos/subject",
        component: SubjectVideosComponent,
        data: { breadcrumb: "videos-subject-list" },
      },
      {
        path: "teacher-module/videos/topic/:id",
        component: TopicVideosComponent,
        data: { breadcrumb: "videos-topic-list" },
      },
      {
        path: "teacher-module/videos/subtopic/:id",
        component: SubtopicVideosComponent,
        data: { breadcrumb: "videos-subtopic-list" },
      },
      {
        path: "teacher-module/videos/video-form/:id",
        component: VideoFormComponent,
        data: { breadcrumb: "video-form" },
      },
      {
        path: "teacher-module/topics/topic-form/:id",
        component: TopicFormComponent,
        data: { breadcrumb: "subtopic-list" },
      },
      {
        path: "group",
        component: GroupComponent,
        data: { breadcrumb: "Groups" },
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
