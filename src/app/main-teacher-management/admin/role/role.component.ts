import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Roles } from "../../models/admin-models/role.model";
import { AdminService } from "src/app/services/admin.service";
import {
  PaginatorModel,
  SelectBoxModel,
} from "../../models/Base/FetchBaseModel";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RoleData } from "../models/role";
import { NotificationService } from "src/app/shared/services/notification.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { SweatAlertService } from "src/app/shared/services/sweat-alert.service";

@Component({
  selector: "app-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.scss"],
})
export class RoleComponent implements OnInit {
  pageSize = 5;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [

    "name",
    // "edit",
    "remove",
  ];
  dataSource: MatTableDataSource<Roles> = new MatTableDataSource<Roles>();
  paginatorModel: PaginatorModel;
  paginatorModel1: PaginatorModel;

  invalid: boolean = false;
  systemServices: SelectBoxModel[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  roleForm: FormGroup;
  editingRoleId;
  UpdateOrAddBtnMessage: string = "Add Role";
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private saService: SweatAlertService
  ) {
    this.paginatorModel = {
      count: this.pageSize,
      page: this.currentPage,
    };
    this.paginatorModel1 = {
      count: 100,
      page: 1,
    };
  }

  ngOnInit(): void {
    this.loadRoles();
    this.initialForm();
    this.fillServicesSelectBox();
  }

  initialForm(): void {
    this.roleForm = this.fb.group({
      name: ["", Validators.required],
      selectedSystemServices: [[], Validators.required],
    });
  }

  loadRoles() {
    this.adminService.fetchRoles(this.paginatorModel).subscribe({
      next: (responseData) => {
        debugger
        const data = responseData.result.data;
        this.dataSource.data =data;
        this.length = responseData.result.count      },
    });
  }

  fillServicesSelectBox() {
    this.adminService.getSystemServices(this.paginatorModel1).subscribe({
      next: (responseData) => {
        this.systemServices = responseData.result.data;
      },
    });
  }

  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    this.loadRoles();
  }

  addRole() {
    if (this.roleForm.invalid) {
      this.invalid = true;
      return;
    }
    const roleData: RoleData = {
      id: this.editingRoleId || null,
      name: this.roleForm.get("name").value,
      selectedPermissions: this.roleForm.get("selectedSystemServices").value,
    };

    if (this.editingRoleId) {
      this.adminService.updateRole(roleData).subscribe({
        next: (responseData) => {
          if (responseData.statusCode==200) {
            this.notificationService.showSuccess(
              responseData.messages
            );
            this.loadRoles();
            this.editingRoleId = 0;
            this.UpdateOrAddBtnMessage = "Add Role";
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
    } else {
      this.adminService.addRole(roleData).subscribe({
        next: (responseData) => {
          if (responseData.statusCode==200) {
            this.notificationService.showSuccess(
              responseData.messages
            );
            this.loadRoles();
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
    }

    this.roleForm.reset();
  }

  editRole(roleData: Roles) {
    this.roleForm.patchValue({
      name: roleData.name,
      selectedSystemServices: roleData.selectedSystemServices,
    });

    this.editingRoleId = roleData.id;
    this.UpdateOrAddBtnMessage = "Update Role";
  }

  onRemoveRole(id: number) {

        this.adminService.removeRole(id).subscribe({
          next: (responseData) => {
            if (responseData.statusCode==200) {
              this.notificationService.showSuccess(
                responseData.messages
              );
              this.loadRoles();
            } else {
              this.notificationService.showError("Any Error happened");
            }
          },
        });

  }

  // private formatRolesData(data: Roles[]): Roles[] {
  //   return data.map((role) => ({
  //     ...role,
  //     selectedSystemServicesString: role.selectedSystemServices.join(", "),
  //   }));
  // }
}
