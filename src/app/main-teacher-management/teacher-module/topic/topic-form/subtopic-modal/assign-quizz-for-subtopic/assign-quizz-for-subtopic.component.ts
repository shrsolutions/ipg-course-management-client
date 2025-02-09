import { Component, Inject, OnInit } from '@angular/core';
import { SubtopicModalComponent } from '../subtopic-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { PaginatorModel } from 'src/app/main-teacher-management/models/Base/FetchBaseModel';
import { AdminService } from 'src/app/services/admin.service';
import { QuizzesService } from 'src/app/services/quizzes.service';
import { showInfoAlert, showErrorAlert } from 'src/app/shared/helper/alert';

@Component({
  selector: 'app-assign-quizz-for-subtopic',
  templateUrl: './assign-quizz-for-subtopic.component.html',
  styleUrls: ['./assign-quizz-for-subtopic.component.scss']
})
export class AssignQuizzForSubtopicComponent implements OnInit {

  constructor(
    private quizzService: QuizzesService,
    public dialogRef: MatDialogRef<SubtopicModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { subtopicId: string },
    private adminService: AdminService,
  ) {}

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
  ngOnInit(): void {
    this.getAllQuizzes()
  }

  getAllQuizzes() {
    this.quizzService.getAllQuizzes(this.paginatorModel).pipe(
      switchMap(res => {
        this.dataSource = new MatTableDataSource<any>(res.result.data);
        this.length = res.result.count;
        return this.adminService.getAssignQuizForSubtopic(this.data.subtopicId);
      })
    ).subscribe({
      next: res => {
        res.result.forEach((item: any) => {
          const matchingItem = this.dataSource.data.find(dataItem => dataItem.id === item.quizId);
          console.log(matchingItem);
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
    console.log(this.quizIds)
    this.adminService.assignQuizForSubtopic(this.data.subtopicId, { quizIds: this.quizIds }).subscribe({
      next: res => {
        showInfoAlert('', res.messages, false, true, 'Close')
        this.dialogRef.close()
      },
      error: err => {
        showErrorAlert('Error', err.message, 'Close')
      }
    })
  }

}
