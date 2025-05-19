import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
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

import { SubtopicModalComponent } from "./teacher-module/topic/topic-form/subtopic-modal/subtopic-modal.component";
import { TopicFormComponent } from "./teacher-module/topic/topic-form/topic-form.component";
import { SubjectVideosComponent } from "./teacher-module/videos/subject-videos/subject-videos.component";
import { TopicVideosComponent } from "./teacher-module/videos/topic-videos/topic-videos.component";
import { SubtopicVideosComponent } from "./teacher-module/videos/subtopic-videos/subtopic-videos.component";
import { VideoFormComponent } from "./teacher-module/videos/video-form/video-form.component";
import { GroupComponent } from "./teacher-module/group/group.component";
import { NewGroupComponent } from "./teacher-module/group/new-group/new-group.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { LanguagesComponent } from "./admin/languages/languages.component";
import { StudentComponent } from "./admin/student/student.component";
import { AssignStudentComponent } from "./teacher-module/group/assign-student/assign-student.component";
import { AddStudentComponent } from "./admin/student/add-student/add-student.component";
import { MatIconModule } from "@angular/material/icon";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import { QuizzesComponent } from "./teacher-module/quizzes/quizzes.component";
import { NewQuizComponent } from "./teacher-module/quizzes/new-quiz/new-quiz.component";
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import { QuillModule } from "ngx-quill";
import { ReadQuestionsComponent } from "./teacher-module/quizzes/read-questions/read-questions.component";
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatMenuModule} from '@angular/material/menu';
import { AssignQuizzComponent } from "./teacher-module/group/assign-quizz/assign-quizz.component";
import { AssignContentComponent } from "./teacher-module/group/assign-content/assign-content.component";
import { AssignQuizzForSubtopicComponent } from "./teacher-module/topic/topic-form/subtopic-modal/assign-quizz-for-subtopic/assign-quizz-for-subtopic.component";
import { ViewGroupComponent } from "./teacher-module/group/view-group/view-group.component";

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
    TopicFormComponent,
    SubtopicModalComponent,
    SubjectVideosComponent,
    TopicVideosComponent,
    SubtopicVideosComponent,
    VideoFormComponent,
    GroupComponent,
    LanguagesComponent,
    NewGroupComponent,
    StudentComponent,
    AssignStudentComponent,
    AssignQuizzComponent,
    AssignContentComponent,
    ViewGroupComponent,
    AssignQuizzForSubtopicComponent,
    AddStudentComponent,
    QuizzesComponent,
    NewQuizComponent,
    ReadQuestionsComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    CommonModule,
    TeacherRoutingModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    NgxSpinnerModule,
    QuillModule.forRoot(),
    MatFormFieldModule,MatListModule, MatMenuModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatDatepickerModule,MatPaginatorModule, MatTabsModule
  ],
  exports: [MainHomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe, ]
})
export class MainTeacherManagementModule {}
