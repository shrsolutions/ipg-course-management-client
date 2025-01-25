import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PaginatorModel } from '../../models/Base/FetchBaseModel';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
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
    private locaStorageService: LocalStorageService,
  ) {

  }

  pageSize = 10;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [
    "title",
    "description",
    "questionCount",
    "durationInMinutes",
    "stateId",
    "edit",
    "remove",
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  paginatorModel: PaginatorModel = {
    count: this.pageSize,
    page: this.currentPage,
  };
  ngOnInit(): void {
    this.getAllQuizzes()
  }

  getAllQuizzes(){
    this.quizzService.getAllQuizzes(this.paginatorModel).subscribe({
      next: res=>{
        console.log()
        this.dataSource = new MatTableDataSource<any>(res.result.data);
        this.length = res.result.count
      }
    })
  }

  

  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    // this.loadLanguage();
  }

  removeQuizz(id: number){
    showConfirmAlert('Delete selected row?', '', 'Delete', `Close`).then((result) => {
      if (result.isConfirmed) {
        this.quizzService.removeQuizz(id).subscribe({
          next: (res: any) => {
              showInfoAlert('', res.messages, false, true, 'Close')
              this.getAllQuizzes()
          },
          error: err => {
            showErrorAlert('Error', err.message, 'Close')
          }
        })
      } 
    })
  }

}
