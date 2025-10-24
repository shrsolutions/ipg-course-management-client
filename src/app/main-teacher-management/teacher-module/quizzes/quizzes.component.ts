import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorModel } from '../../models/Base/FetchBaseModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { QuizzesService } from 'src/app/services/quizzes.service';
import { showConfirmAlert, showErrorAlert, showInfoAlert, showSuccessAlert } from 'src/app/shared/helper/alert';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss']
})
export class QuizzesComponent implements OnInit {

  constructor(
    private quizzService: QuizzesService,
  ) {
  }

  pageSize = 10;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [
    "title",
    "description",
    "questionCount",
    "stateId",
    "edit",
    "remove",
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

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

  // Inputlardan gələn dəyərlər üçün
  titleFilter: string = '';
  questionCountMin: number | null = null;
  questionCountMax: number | null = null;
  stateSortDirection: 'ascending' | 'descending' = 'descending';
  ngOnInit(): void {
    // this.getAllQuizzes()
    this.fetchQuizzes()
  }

  getAllQuizzes() {
    this.quizzService.getAllQuizzes(this.paginatorModel).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource<any>(res.result.data);
        this.length = res.result.count
      }
    })
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
    this.filters.page = event.pageIndex + 1;
    this.filters.count = event.pageSize;
    this.fetchQuizzes()
  }

  removeQuizz(id: number) {
    showConfirmAlert('Delete selected row?', '', 'Delete', `Close`).then((result) => {
      if (result.isConfirmed) {
        this.quizzService.removeQuizz(id).subscribe({
          next: (res: any) => {
            showInfoAlert('', res.messages, false, true, 'Close')
            this.fetchQuizzes()
          },
          error: err => {
            showErrorAlert('Error', err.message, 'Close')
          }
        })
      }
    })
  }

}
