import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import {
  PaginatorModel,
  SelectBoxModel,
} from "../../models/Base/FetchBaseModel";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { FormGroup } from "@angular/forms";
import { Users } from "../../models/admin-models/role.model";
import { AdminService } from "src/app/services/admin.service";
import { MatDialog } from "@angular/material/dialog";
import { SetNewRoleComponent } from "./set-new-role/set-new-role.component";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-user-acivate",
  templateUrl: "./user-acivate.component.html",
  styleUrls: ["./user-acivate.component.scss"],
})
export class UserAcivateComponent implements OnInit {
  pageSize = 5;
  currentPage = 1;
  dataSource: MatTableDataSource<Users> = new MatTableDataSource<Users>();
  paginatorModel: PaginatorModel;
  length!: number
  invalid: boolean = false;
  systemServices: SelectBoxModel[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  roleForm: FormGroup;
  editingRoleId;
  UpdateOrAddBtnMessage: string = "Add Role";
  displayedColumns: string[] = [
    "id",
    "email",
    "fullName",
    "userStatusId",
    "setRole",
    "blockedUser",
  ];

  userStatusClass = {
    1: "fas fa-registered",
    2: "fas fa-unlock",
    3: "fas fa-user-check",
    4: "fas fa-user-lock",
  };

  userStatusText = {
    1: "Registered",
    2: "EmailConfirmed",
    3: "Active",
    4: "Blocked",
  };

  roleIds = [];
  constructor(
    private adminService: AdminService,
    public setRoleDialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.paginatorModel = {
      count: this.pageSize,
      page: this.currentPage,
    };
  }
  ngOnInit(): void {
    this.onLoadUsers();
  }
  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    this.onLoadUsers();

  }

  onLoadUsers() {
    this.adminService.fetchAllUsers(this.paginatorModel).subscribe({
      next: (responseData) => {
        const data = responseData.result.data;
        console.log(data);
        this.roleIds = [
          ...data.map((resData) => resData.userRoles.map((x) => x.roleId)),
        ];
        this.dataSource.data = data;
       this.length = responseData.result.count

      },
    });
  }

  onSetNewRole(id: number, roleIds: any[]) {
    roleIds = roleIds.map((role) => role.roleId);
    console.log(roleIds);
    let dialogRef = this.setRoleDialog.open(SetNewRoleComponent, {
      height: "240px",
      width: "600px",
      data: { userId: id, roleIds: roleIds },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onLoadUsers();
      }
    });
  }

  onBlockedOrUnblockedUser(id: number, userStatusId: number) {
    if (userStatusId == 4) {
      this.adminService.onUserActivate(id).subscribe({
        next: (response) => {
          if (response.messages.includes(OPERATION_MESSAGE.success)) {
            this.notificationService.showSuccess("User activated succesfully");
            this.onLoadUsers();
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
      return;
    }

    this.adminService.onUserBlock(id).subscribe({
      next: (response) => {
        if (response.messages.includes(OPERATION_MESSAGE.success)) {
          this.notificationService.showSuccess("User Blocked succesfully");
          this.onLoadUsers();
        } else {
          this.notificationService.showError("Any Error happened");
        }
      },
    });
  }
}
