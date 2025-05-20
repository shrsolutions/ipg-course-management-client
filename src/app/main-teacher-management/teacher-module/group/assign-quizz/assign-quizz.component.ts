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
    "durationInMinutes",
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
          const matchingItem = this.dataSource.data.find(dataItem => dataItem.id === item.quizId);
          if (matchingItem) {
            this.quizIds.push(matchingItem.id);
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

  quizIds: number[] = [];

  toggleSelection(row: any): void {
    const index = this.quizIds.indexOf(row.id);
    if (index === -1) {
      this.quizIds.push(row.id); // Add ID to the array
    } else {
      this.quizIds.splice(index, 1); // Remove ID from the array
    }
  }

  isSelected(row: any): boolean {
    return this.quizIds.indexOf(row.id) !== -1;
  }

  toggleAll(event: any): void {
    if (event.checked) {
      this.quizIds = this.dataSource.data.map(row => row.id);
    } else {
      this.quizIds = [];
    }
  }

  isAllSelected(): boolean {
    return this.dataSource.data.every(row => this.quizIds.indexOf(row.id) !== -1);
  }

  isIndeterminate(): boolean {
    return this.quizIds.length > 0 && !this.isAllSelected();
  }

  assignQuiz() {
    this.adminService.assignQuiz(this.data.groupId, { quizIds: this.quizIds }).subscribe({
      next: res => {
        showInfoAlert('', res.messages, false, true, 'Close')
        this.dialogRef.close()
      },
      error: err => {
        showErrorAlert('Error', err.message, 'Close')
      }
    })
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
    console.log(this.categorieId)
    this.libraryService.fetchSubjectsByCategoryId(this.categorieId, this.paginatorModelForSelectBox).subscribe({
      next: (responseData) => {
        this.subjects = responseData.result.data.map((v) => ({
          key: v.id,
          value: v.translationInCurrentLanguage,
        }));
      },
    });
  }

  onLoadTopics(): void {
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
