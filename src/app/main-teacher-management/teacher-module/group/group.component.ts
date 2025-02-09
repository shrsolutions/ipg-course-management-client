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

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {
  pageSize = 5;
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

  ) {
    this.paginatorModel = {
      count: this.pageSize,
      page: this.currentPage,
    };
    this.paginatorModel1 = {
      count: 100,
      page: 1,
    };
    this.data.filterPredicate = this.createFilter();

  }
  createFilter(): (data: any, filter: string) => boolean {

    return (data, filter): boolean => {
      const searchTerms = JSON.parse(filter);
      const isNameMatching = !searchTerms.name || data.name?.toLowerCase().includes(searchTerms.name.toLowerCase());
      const isCountMatching =
        !searchTerms.count || (data.count !== undefined && data.count.toString().includes(searchTerms.count));
      const isWithinDateRange =
        (!searchTerms.beginDate || new Date(data.createDate) >= new Date(searchTerms.beginDate)) &&
        (!searchTerms.endDate || new Date(data.createDate) <= new Date(searchTerms.endDate));

      return isNameMatching && isWithinDateRange && isCountMatching;

    };
  }

  applyFilterColumn() {

    this.filters.beginDate = this.beghinDate.value ? this.beghinDate.value.toISOString().split('T')[0] : '';
    this.filters.endDate = this.endDate.value ? this.endDate.value.toISOString().split('T')[0] : '';
    const filterValues = JSON.stringify(this.filters);
    this.data.filter = filterValues;
  }

  readonly campaignOne = new FormGroup({
    start: new FormControl(new Date(this.year, this.month, this.today.getDate() - 30)),
    end: new FormControl(new Date(this.year, this.month, this.today.getDate())),
  });

  readonly beghinDate = new FormControl(new Date(this.year, this.month, this.today.getDate() - 30));
  readonly endDate = new FormControl(new Date());

  ngOnInit(): void {
    this.loadGroups();
    this.initialForm();
    this.data.filterPredicate = this.createFilter();
  }

  initialForm(): void {
    this.GroupForm = this.fb.group({
      name: ["", Validators.required],
      selectedSystemServices: [[], Validators.required],
    });
  }
  filters = {
    name: '',
    beginDate: '',
    endDate: '',
    count: ''
  };
  length!: number

  loadGroups() {

    this.adminService.fetchGroups(this.paginatorModel).subscribe({
      next: (responseData) => {
        this.data = new MatTableDataSource<any>(responseData.result.data);
        this.data.filterPredicate = this.createFilter();
        this.length = responseData.result.count

      },
    });
  }


  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    this.loadGroups();
  }

  onRemoveGroup(id: number) {

    this.adminService.removeGroup(id).subscribe({
      next: (responseData) => {
        if (responseData.statusCode == 200) {
          this.notificationService.showSuccess(
            responseData.messages
          );
          this.loadGroups();
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
      this.loadGroups();
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
        this.loadGroups();
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
