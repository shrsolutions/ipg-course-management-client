import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { PaginatorModel } from 'src/app/main-teacher-management/models/Base/FetchBaseModel';
import { AdminService } from 'src/app/services/admin.service';
import { showInfoAlert, showErrorAlert } from 'src/app/shared/helper/alert';
import { GroupComponent } from '../group.component';

@Component({
  selector: 'app-assign-content',
  templateUrl: './assign-content.component.html',
  styleUrls: ['./assign-content.component.scss']
})
export class AssignContentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GroupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { groupId: string },
    private adminService: AdminService,
  ) { }

  pageSize = 10;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [
    "select",
    "name",
    "description",
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
    dateRangeFilters: [],
    sortByProperties: []
  };

  nameFilter: string = '';
  descriptionFilter: string = '';


  ngOnInit(): void {
    this.getAllAttachmentsLink()
  }

  getAllAttachmentsLink() {
    this.adminService.getAllAttachmentsLink(this.filters).pipe(
      switchMap((res: any) => {
        this.dataSource = new MatTableDataSource<any>(res.result.data);
        this.length = res.result.count;
        return this.adminService.getAssignContent(this.data.groupId);
      })
    ).subscribe({
      next: res => {
        res.result.forEach((item: any) => {
          const matchingItem = this.dataSource.data.find(dataItem => dataItem.id === item.contentId);
          if (matchingItem) {
            this.contentIds.push(matchingItem.id);
          }
        });
      }
    });
  }



  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    this.getAllAttachmentsLink()
  }

  contentIds: number[] = [];

  toggleSelection(row: any): void {
    const index = this.contentIds.indexOf(row.id);
    if (index === -1) {
      this.contentIds.push(row.id); // Add ID to the array
    } else {
      this.contentIds.splice(index, 1); // Remove ID from the array
    }
  }

  isSelected(row: any): boolean {
    return this.contentIds.indexOf(row.id) !== -1;
  }

  toggleAll(event: any): void {
    if (event.checked) {
      this.contentIds = this.dataSource.data.map(row => row.id);
    } else {
      this.contentIds = [];
    }
  }

  isAllSelected(): boolean {
    return this.dataSource.data.every(row => this.contentIds.indexOf(row.id) !== -1);
  }

  isIndeterminate(): boolean {
    return this.contentIds.length > 0 && !this.isAllSelected();
  }

  assignQuiz() {
    this.adminService.assignContent(this.data.groupId, { contentIds: this.contentIds }).subscribe({
      next: res => {
        showInfoAlert('', res.messages, false, true, 'Close')
        this.dialogRef.close()
      },
      error: err => {
        showErrorAlert('Error', err.message, 'Close')
      }
    })
  }

  applyFilters() {
    this.filters.exactFilters = [];
    if (this.nameFilter) {
      this.filters.exactFilters.push({
        propertyName: 'name',
        value: this.nameFilter
      });
    }
    if (this.descriptionFilter) {
      this.filters.exactFilters.push({
        propertyName: 'description',
        value: this.descriptionFilter
      });
    }


    this.getAllAttachmentsLink();
  }


}
