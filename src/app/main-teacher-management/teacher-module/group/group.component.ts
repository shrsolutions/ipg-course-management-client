import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorModel, SelectBoxModel } from '../../models/Base/FetchBaseModel';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SweatAlertService } from 'src/app/shared/services/sweat-alert.service';
import { NewGroupComponent } from './new-group/new-group.component';
import { MatDialog } from '@angular/material/dialog';
import { AssignStudentComponent } from './assign-student/assign-student.component';
import { AssignQuizzComponent } from './assign-quizz/assign-quizz.component';
import { AssignContentComponent } from './assign-content/assign-content.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {
  pageSize = 20;
  currentPage = 1;
  displayedColumns: string[] = [
    "name",
    "createDate",
    "studentCount",
    "edit",
    "remove",

  ];
  data: MatTableDataSource<any> = new MatTableDataSource<any>();
  paginatorModel: PaginatorModel;
  paginatorModel1: PaginatorModel;

  invalid: boolean = false;
  systemServices: SelectBoxModel[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  GroupForm: FormGroup;
  editingGroupId;
  today: any = new Date();
  month: any = this.today.getMonth();
  year: any = this.today.getFullYear();
  selectedRow: any ;
  activeRow: any = -1;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private saService: SweatAlertService,
    public setRoleDialog: MatDialog,
    private datePipe: DatePipe

  ) {
    this.paginatorModel = {
      count: this.pageSize,
      page: this.currentPage,
    };

  }

  filters = {
    page: 1,
    count: 20,
    exactFilters: [],
    dateRangeFilters: [],
    sortByProperties: []
  };

  titleFilter: string = '';
  startDate: any | null = null;
  endDate: any | null = null;
  stateSortDirection: 'ascending' | 'descending'  = 'descending';


  ngOnInit(): void {
    this.fetchGroups();
    this.initialForm();
  }

  initialForm(): void {
    this.GroupForm = this.fb.group({
      name: ["", Validators.required],
      selectedSystemServices: [[], Validators.required],
    });
  }
  
  length!: number

  loadGroups() {
    this.adminService.fetchGroups(this.paginatorModel).subscribe({
      next: (responseData) => {
        this.data = new MatTableDataSource<any>(responseData.result.data);
        this.length = responseData.result.count
      },
    });
  }

  applyFilters() {
    this.filters.exactFilters = [];
    if (this.titleFilter) {
      this.filters.exactFilters.push({
        propertyName: 'name',
        value: this.titleFilter
      });
    }
  
    this.filters.dateRangeFilters = [];
    if (this.startDate !== null || this.endDate !== null) {
      this.filters.dateRangeFilters.push({
        propertyName: 'createDate',
        greaterThanOrEqualValue: this.formatDate(this.startDate) ,
        lessThanOrEqualValue:this.formatDate(this.endDate)
      });
    }
  
    this.fetchGroups(); 
  }

  formatDate(selectedDate: Date): string {
    return this.datePipe.transform(selectedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")!;
  }

  fetchGroups() {
    this.adminService.getAllGroups(this.filters).subscribe((res: any) => {
      this.data = new MatTableDataSource<any>(res.result.data);
        this.length = res.result.count
    });
  }

  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    this.fetchGroups();
  }

  onRemoveGroup(id: number) {

    this.adminService.removeGroup(id).subscribe({
      next: (responseData) => {
        if (responseData.statusCode == 200) {
          this.notificationService.showSuccess(
            responseData.messages
          );
          this.fetchGroups();
        } else {
          this.notificationService.showError("Any Error happened");
        }
      },
    });

  }
  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
  }
  private formatGroupsData(data: any[]): any[] {
    return data.map((Group) => ({
      ...Group,
      selectedSystemServicesString: Group.selectedSystemServices.join(", "),
    }));
  }
  onSetNewGroup(id: number, name?: any) {
    let dialogRef = this.setRoleDialog.open(NewGroupComponent, {
      height: "240px",
      width: "600px",
      data: { id: id, name: name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.fetchGroups();
      this.activeRow = -1;
      this.selectedRow = undefined;

    });
  }
  onSetNewStudent() {
    let dialogRef = this.setRoleDialog.open(AssignStudentComponent, {
      height: "260px",
      width: "600px",
      data: { userId: this.selectedRow.id, roleIds: this.selectedRow.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchGroups();
        this.activeRow = -1;
        this.selectedRow = undefined;
      }
    });
  }

  assignQuizz(){
    let dialogRef = this.setRoleDialog.open(AssignQuizzComponent, {
      maxHeight: "95vh",
      width: "50%",
      data: { groupId: this.selectedRow.id},
    });

    dialogRef.afterClosed().subscribe((result) => {
        this.loadGroups();
        this.activeRow = -1;
        this.selectedRow = undefined;
    });
  }

  assignContent(){
    let dialogRef = this.setRoleDialog.open(AssignContentComponent, {
      maxHeight: "95vh",
      width: "50%",
      data: { groupId: this.selectedRow.id},
    });
    dialogRef.afterClosed().subscribe((result) => {
        this.loadGroups();
        this.activeRow = -1;
        this.selectedRow = undefined;
    });
  }

  onRowClick(index:number, row: any): void {
    if (!this.isActive(index)) {
      this.activeRow = index;
      this.selectedRow = row;
    }
    else {
      this.activeRow = -1;
      this.selectedRow = 0;
    }
  }

  isActive = (index: number) => { return this.activeRow === index };

}
