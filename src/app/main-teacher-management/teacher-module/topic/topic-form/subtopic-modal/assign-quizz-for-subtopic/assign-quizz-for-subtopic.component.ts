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
    public data: { subtopicId: string, type: string },
    private adminService: AdminService,
  ) { }

  pageSize = 10;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [
    "select",
    "title",
    "description",
    "questionCount",
    "edit",

  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  paginatorModel: PaginatorModel = {
    count: this.pageSize,
    page: this.currentPage,
  };

    filters = {
    page: this.currentPage,
    count: this.pageSize,
    exactFilters: [],
    integerRangeFilters: [],
    sortByProperties: []
  };

    titleFilter: string = '';
  questionCountMin: number | null = null;
  questionCountMax: number | null = null;
  stateSortDirection: 'ascending' | 'descending'  = 'descending';
  ngOnInit(): void {
    // this.getAllQuizzes()
    this.fetchQuizzes()

  }

  viewData: any
  getAllQuizzes() {
    this.quizzService.getAllQuizzes(this.paginatorModel).pipe(
      switchMap(res => {
        if (this.data.type !== "view") {
          this.dataSource = new MatTableDataSource<any>(res.result.data);
          this.length = res.result.count;
        }else{
          this.viewData = res.result.data
        }
        return this.adminService.getAssignQuizForSubtopic(this.data.subtopicId);
      })
    ).subscribe({
      next: resquizz => {
        resquizz.result.forEach((item: any) => {
          const matchingItem = this.dataSource.data.find(dataItem => dataItem.id === item.quizId);
          
          if (this.data.type == "view") {
            this.dataSource = new MatTableDataSource<any>(this.viewData);
            const filteredData = this.dataSource.data.filter(dataItem =>
              resquizz.result.some(item => dataItem.id === item.quizId)
            );
            this.dataSource.data = filteredData;
            this.length = filteredData.length

          } else {
            if (matchingItem) {
              this.quizIds.push(matchingItem.id);
            }
          }
        });
      }
    });
  }

  applyFilters() {
    // ExactFilters
    this.filters.exactFilters = [];
    if (this.titleFilter) {
      this.filters.exactFilters.push({
        propertyName: 'title',
        value: this.titleFilter
      });
    }
  
    // IntegerRangeFilters
    this.filters.integerRangeFilters = [];
    if (this.questionCountMin !== null || this.questionCountMax !== null) {
      this.filters.integerRangeFilters.push({
        propertyName: 'questionCount',
        greaterThanOrEqualValue: this.questionCountMin,
        lessThanOrEqualValue: this.questionCountMax
      });
    }
  
    // SortByProperties
    this.filters.sortByProperties = [];
    if (this.stateSortDirection) {
      this.filters.sortByProperties.push({
        propertyName: 'stateId',
        sortingType: this.stateSortDirection
      });
    }
  
    this.fetchQuizzes(); // API sorğusunu göndər
  }

  fetchQuizzes() {
    this.quizzService.getAllQuizzes2(this.filters).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<any>(res.result.data);
        this.length = res.result.count
    });
  }
  
  toggleSort(column: string) {
    this.stateSortDirection = this.stateSortDirection === 'ascending' ? 'descending' : 'ascending';
    this.applyFilters();
  }


  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    // this.getAllQuizzes()
    this.fetchQuizzes()

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


