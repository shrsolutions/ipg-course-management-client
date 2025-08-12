import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorModel } from '../../models/Base/FetchBaseModel';
import { AdminService } from 'src/app/services/admin.service';
import { showConfirmAlert, showErrorAlert, showInfoAlert } from 'src/app/shared/helper/alert';
import { NewTeacherComponent } from './new-teacher/new-teacher.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    public openMatDialog: MatDialog,
  ) { }

  pageSize = 10;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [
    "name",
    "surname",
    "image",
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
  };
  nameFilter: string = '';
  surnameFilter: string = '';

  ngOnInit() {
    this.getAllTutors()
  }


  getAllTutors() {
    this.adminService.getAllTutors(this.filters).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<any>(res.result.data);
      console.log(res.result.data)
      this.length = res.result.count
    });
  }

  getTutorImage(tutorId: string, imageId: string) {
    return this.adminService.getTutorImagebyTutorID(tutorId, imageId)
  }

  applyFilters() {
    // ExactFilters
    this.filters.exactFilters = [];
    if (this.nameFilter) {
      this.filters.exactFilters.push({
        propertyName: 'name',
        value: this.nameFilter
      });
    }
    if (this.surnameFilter) {
      this.filters.exactFilters.push({
        propertyName: 'surname',
        value: this.surnameFilter
      });
    }

    this.getAllTutors(); // API sorğusunu göndər
  }

  onPageChanged(event: PageEvent) {
    this.filters.page = event.pageIndex + 1;
    this.filters.count = event.pageSize;
    this.getAllTutors()
  }

  removeTutor(id: string) {
    showConfirmAlert('Delete selected row?', '', 'Delete', `Close`).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteTutor(id).subscribe({
          next: (res: any) => {
            showInfoAlert('', res.messages, false, true, 'Close')
            this.getAllTutors()
          },
          error: err => {
            showErrorAlert('Error', err.message, 'Close')
          }
        })
      }
    })
  }

  openDialog(tutorId: string = '') {
    let dialogRef = this.openMatDialog.open(NewTeacherComponent, {
      maxHeight: "95vh",
      width: "40%",
      data: { tutorId: tutorId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllTutors();
    });
  }

}
