import { Component, Inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorModel, SelectBoxModel } from 'src/app/main-teacher-management/models/Base/FetchBaseModel';
import { QuizzesService } from 'src/app/services/quizzes.service';
import { showConfirmAlert, showInfoAlert, showErrorAlert } from 'src/app/shared/helper/alert';
import { GroupComponent } from '../group.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin.service';
import { switchMap } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-assign-quizz',
  templateUrl: './assign-quizz.component.html',
  styleUrls: ['./assign-quizz.component.scss']
})
export class AssignQuizzComponent implements OnInit {

  constructor(
    private quizzService: QuizzesService,
    public dialogRef: MatDialogRef<GroupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { groupId: string },
    private adminService: AdminService,
    private libraryService: LibraryService,
  ) { }

  categories: SelectBoxModel[] = [];
  subjects: SelectBoxModel[] = [];
  topics: SelectBoxModel[] = [];
  subTopics: SelectBoxModel[] = [];

  categorieId: string = null
  subjectId: string = null
  topicId: string = null
  subTopicId: string = null

  pageSize = 10;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [
    "select",
    "title",
    "description",
    "questionCount",
    "stateId"
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  paginatorModel: PaginatorModel = {
    count: this.pageSize,
    page: this.currentPage,
  };

  paginatorModelForSelectBox: PaginatorModel = {
    count: 9999,
    page: 1,
  };

  selectedQuizzes: { quizId: string; subjectId: string | null }[] = [];

  ngOnInit(): void {
    this.getAllQuizzes()
    this.fillCategorySelectBox()
  }

  getAllQuizzes() {
    this.quizzService.getAllQuizzes(this.paginatorModel, {
      SubjectId: this.subjectId,
      TopicId: this.topicId,
      SubtopicId: this.subTopicId
    }).pipe(
      switchMap(res => {
        this.dataSource = new MatTableDataSource<any>(res.result.data);
        this.length = res.result.count;
        return this.adminService.getAssignQuiz(this.data.groupId);
      })
    ).subscribe({
      next: res => {
        res.result.forEach((item: any) => {
          const existing = this.selectedQuizzes.find(q => q.quizId === item.quizId && q.subjectId === (item.subjectId || null));
          if (!existing) {
            this.selectedQuizzes.push({ quizId: item.quizId, subjectId: item.subjectId || null });
          }
        });
      }
    });
  }


  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    this.getAllQuizzes()
  }


  toggleSelection(row: any): void {
    const currentSubjectId = this.subjectId;
    const index = this.selectedQuizzes.findIndex(q => q.quizId === row.id && q.subjectId === currentSubjectId);
    if (index === -1) {
      this.selectedQuizzes.push({ quizId: row.id, subjectId: currentSubjectId });
    } else {
      this.selectedQuizzes.splice(index, 1);
    }
  }

  isSelected(row: any): boolean {
    return this.selectedQuizzes.some(q => q.quizId === row.id && q.subjectId === this.subjectId);
  }
  toggleAll(event: any): void {
    const currentSubjectId = this.subjectId;
    if (event.checked) {
      this.dataSource.data.forEach(row => {
        if (!this.selectedQuizzes.some(q => q.quizId === row.id && q.subjectId === currentSubjectId)) {
          this.selectedQuizzes.push({ quizId: row.id, subjectId: currentSubjectId });
        }
      });
    } else {
      this.selectedQuizzes = this.selectedQuizzes.filter(q => q.subjectId !== currentSubjectId);
    }
  }

  isAllSelected(): boolean {
    return this.dataSource.data.every(row => this.isSelected(row));
  }

  isIndeterminate(): boolean {
    const selectedInCurrent = this.selectedQuizzes.filter(q => q.subjectId === this.subjectId).length;
    return selectedInCurrent > 0 && !this.isAllSelected();
  }

  assignQuiz() {
    const postData = { quizzes: this.selectedQuizzes };
    this.adminService.assignQuiz(this.data.groupId, postData).subscribe({
      next: res => {
        showInfoAlert('', res.messages, false, true, 'Close');
        this.dialogRef.close();
      },
      error: err => {
        showErrorAlert('Error', err.message, 'Close');
      }
    });
  }

  fillCategorySelectBox() {
    this.libraryService.fetchAllCategories(this.paginatorModelForSelectBox).subscribe({
      next: ({ result }) => {
        this.categories = result.data.map((v) => ({
          key: v.id,
          value: v.translationInCurrentLanguage,
        }));
      },
    });
  }

  onLoadSubject(): void {
    this.subjects = []
    this.topics = []
    this.subTopics = []
    this.subjectId = null;
    if (!this.categorieId) {
      this.subjectId = null;
      this.topicId = null
      this.subTopicId = null
      this.getAllQuizzes()
    } else {
      this.libraryService.fetchSubjectsByCategoryId(this.categorieId, this.paginatorModelForSelectBox).subscribe({
        next: (responseData) => {
          this.subjects = responseData.result.data.map((v) => ({
            key: v.id,
            value: v.translationInCurrentLanguage,
          }));

          if (this.data.groupId) {
            this.adminService.getAssignQuiz(this.data.groupId).subscribe({
              next: res => {
                res.result.forEach((item: any) => {
                  const existing = this.selectedQuizzes.find(q => q.quizId === item.quizId && q.subjectId === (item.subjectId || null));
                  if (!existing) {
                    this.selectedQuizzes.push({ quizId: item.quizId, subjectId: item.subjectId || null });
                  }
                });
              }
            })
          }
        },
      });
    }

  }

  onLoadTopics(): void {
    this.topics = []
    this.subTopics = []
    this.topicId = null;
    this.libraryService.fetchTopicsBySubjectId(this.subjectId, this.paginatorModelForSelectBox).subscribe({
      next: (response) => {
        this.topics = response.result.data.map((v) => ({
          key: v.id,
          value: v.translationInCurrentLanguage,
        }));
      },
    });
  }

  onLoadSubTopics(): void {
    this.subTopics = []
    this.subTopicId = null;
    this.libraryService.fetchSubTopicsByTopicId(this.topicId, this.paginatorModelForSelectBox).subscribe({
      next: (response) => {
        this.subTopics = response.result.data.map((v) => ({
          key: v.id,
          value: v.translationInCurrentLanguage,
        }));
      },
    });
  }


}
