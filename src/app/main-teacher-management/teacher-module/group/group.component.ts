import { Component, ViewChild } from '@angular/core';
import { OPERATION_MESSAGE } from 'src/app/shared/enums/api-enum';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorModel, SelectBoxModel } from '../../models/Base/FetchBaseModel';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SweatAlertService } from 'src/app/shared/services/sweat-alert.service';
import { NewGroupComponent } from './new-group/new-group.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {
  pageSize = 5;
  currentPage = 1;
  displayedColumns: string[] = [
    "id",
    "name",
    "createDate",
    "studentCount",
    "edit",
    "remove",
    "addStudent",

  ]; // Adjust columns accordingly
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  paginatorModel: PaginatorModel;
  invalid: boolean = false;
  systemServices: SelectBoxModel[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  GroupForm: FormGroup;
  editingGroupId;
   today :any= new Date();
   month :any= this.today.getMonth();
   year :any= this.today.getFullYear();
  UpdateOrAddBtnMessage: string = "Add Group";
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private saService: SweatAlertService,
    public setRoleDialog: MatDialog
  ) {
    this.paginatorModel = {
      count: this.pageSize,
      page: this.currentPage,
    };
  }

  readonly campaignOne = new FormGroup({
    start: new FormControl(new Date(this.year, this.month, this.today.getDate()-30)),
    end: new FormControl(new Date(this.year, this.month, this.today.getDate())),
  });
  
  readonly beghinDate = new FormControl(new Date(this.year, this.month, this.today.getDate()-30));
  readonly endDate = new FormControl(new Date());

  ngOnInit(): void {
    
    this.loadGroups();
    this.initialForm();
    this.fillServicesSelectBox();
    
  }

  initialForm(): void {
    this.GroupForm = this.fb.group({
      name: ["", Validators.required],
      selectedSystemServices: [[], Validators.required],
    });
  }
  length!: number

  loadGroups() {
    this.dataSource.data =[{
      id:1,name:'Group1',date:'01.12.2024',count:2
    }]
       this.length = 1

    // this.adminService.fetchRoles(this.paginatorModel).subscribe({
    //   next: (responseData) => {
    //     const data = responseData.result.data;
    //     this.dataSource.data = this.formatGroupsData(data);
    //     this.length = responseData.result.count

    //   },
    // });
  }

  fillServicesSelectBox() {
    this.adminService.getSystemServices().subscribe({
      next: (responseData) => {
        this.systemServices = responseData.result;
      },
    });
  }

  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    this.loadGroups();
  }

  addGroup() {
    // if (this.GroupForm.invalid) {
    //   this.invalid = true;
    //   return;
    // }
    
    // const GroupData: any = {
    //   id: this.editingGroupId || 0,
    //   name: this.GroupForm.get("name").value,
    //   selectedSystemServices: this.GroupForm.get("selectedSystemServices").value,
    // };

    // if (this.editingGroupId) {
    //   this.adminService.updateRole(GroupData).subscribe({
    //     next: (responseData) => {
    //       if (responseData.messages.includes(OPERATION_MESSAGE.success)) {
    //         this.notificationService.showSuccess("Group updated succesfully");
    //         this.loadGroups();
    //         this.editingGroupId = 0;
    //         this.UpdateOrAddBtnMessage = "Add Group";
    //       } else {
    //         this.notificationService.showError("Any Error happened");
    //       }
    //     },
    //   });
    // } else {
    //   this.adminService.addRole(GroupData).subscribe({
    //     next: (responseData) => {
    //       if (responseData.messages.includes(OPERATION_MESSAGE.success)) {
    //         this.notificationService.showSuccess("Group added succesfully");
    //         this.loadGroups();
    //       } else {
    //         this.notificationService.showError("Any Error happened");
    //       }
    //     },
    //   });
    // }

    // this.GroupForm.reset();
  }

  editGroup(GroupData: any) {
    // this.GroupForm.patchValue({
    //   name: GroupData.name,
    //   selectedSystemServices: GroupData.selectedSystemServices,
    // });

    // this.editingGroupId = GroupData.id;
    // this.UpdateOrAddBtnMessage = "Update Group";
  }

  onRemoveGroup(id: number) {
    // this.saService.confirmDialog().then((result) => {
    //   if (result.isConfirmed) {
    //     this.adminService.removeRole(id).subscribe({
    //       next: (responseData) => {
    //         if (responseData.messages.includes(OPERATION_MESSAGE.success)) {
    //           this.notificationService.showSuccess("Group deleted succesfully");
    //           this.loadGroups();
    //         } else {
    //           this.notificationService.showError("Any Error happened");
    //         }
    //       },
    //     });
    //   }
    // });
  }

  private formatGroupsData(data: any[]): any[] {
    return data.map((Group) => ({
      ...Group,
      selectedSystemServicesString: Group.selectedSystemServices.join(", "),
    }));
  }
  onSetNewGroup(id: number,name?:any) {
    let dialogRef = this.setRoleDialog.open(NewGroupComponent, {
      height: "240px",
      width: "600px",
      data: { id: id,name:name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadGroups();
      }
    });
  }
}
