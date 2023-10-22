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
  ];

  constructor(private adminService: AdminService) {
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
  }

  onLoadUsers() {
    this.adminService.fetchAllUsers(this.paginatorModel).subscribe({
      next: (responseData) => {
        const data = responseData.result.data;
        this.dataSource.data = data;
        this.paginator.pageIndex = this.currentPage;
        this.paginator.pageSize = responseData.result.count;
        this.pageSize = responseData.result.count;
      },
    });
  }
}
