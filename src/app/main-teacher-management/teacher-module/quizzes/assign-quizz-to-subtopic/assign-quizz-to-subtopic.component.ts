import { Component, Inject, OnInit } from '@angular/core';
import { NewQuizComponent } from '../new-quiz/new-quiz.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LibraryService } from 'src/app/services/library.service';
import { PaginatorModel } from 'src/app/main-teacher-management/models/Base/FetchBaseModel';
import { AdminService } from 'src/app/services/admin.service';
import { showErrorAlert, showInfoAlert } from 'src/app/shared/helper/alert';

@Component({
  selector: 'app-assign-quizz-to-subtopic',
  templateUrl: './assign-quizz-to-subtopic.component.html',
  styleUrls: ['./assign-quizz-to-subtopic.component.scss']
})
export class AssignQuizzToSubtopicComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewQuizComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { quizId: string },
    private libraryService: LibraryService,
    private adminService: AdminService,

  ) { }

  paginatorModel: PaginatorModel = {
    count: 100,
    page: 1,
  };

  categories: any[] = [];
  subjects: any[] = [];
  topics: any[] = [];
  subTopics: any[] = [];
  quizzIds: any

  ngOnInit() {
    this.getAllCategories()
  }

  getAllCategories(): void {
    this.libraryService.fetchAllCategories(this.paginatorModel).subscribe({
      next: (response) => {
        this.categories = response.result.data
      },
    });
  }

  getSubjectbyCategoryId(categoryId: string) {
    this.libraryService.fetchSubjectsByCategoryId(categoryId, this.paginatorModel).subscribe({
      next: (responseData) => {
        this.subjects = responseData.result.data;
      },
    });
  }

  getTopicstbySubjectId(subjectId) {
    this.libraryService.fetchTopicsBySubjectId(subjectId, this.paginatorModel).subscribe({
      next: (response) => {
        this.topics = response.result.data;
      },
    });
  }

  getSubTopicstbyTopicId(topicId) {
    this.libraryService.fetchSubTopicsByTopicId(topicId, this.paginatorModel).subscribe({
      next: (response) => {
        this.subTopics = response.result.data;
      },
    });
  }

  subtopicId: string
  getAssignQuizForSubtopic(subtopicId: string) {
    this.subtopicId = subtopicId
    this.adminService.getAssignQuizForSubtopic(subtopicId).subscribe({
      next: res => {
        this.quizzIds = {
          quizIds: res.result.map(item => item.quizId)
        };
        this.quizzIds.quizIds.push(this.data.quizId)

      }
    })
  }


  assignToSubtopic() {
    this.adminService.assignQuizForSubtopic(this.subtopicId, this.quizzIds).subscribe({
      next: resSubTOpic => {
        this.dialogRef.close(true)
      },
      error: err => {
        showErrorAlert('Error', err.message, 'Close')
      }
    })
  }

}

// selectboxdan subtopic secildikden sonra bura request at ve bu subtopice assign olunmus quizleri cek

// if (this.subTopicId) {
//   this.adminService.getAssignQuizForSubtopic(this.subTopicId).subscribe({
//     next: res => {
//       this.quizzIds = {
//         quizIds: res.result.map(item => item.quizId)
//       };

//     }
//   })
// }

// sonra yaradilmis quizin idsin gelen quiz idlere push et sonda ise save et

// this.quizzIds.quizIds.push(res.result)
