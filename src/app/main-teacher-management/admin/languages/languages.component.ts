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
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent {
pageSize = 5;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [
    
    "name",
    "edit",
    "remove",
  ]; 
  dataSource: MatTableDataSource<Roles> = new MatTableDataSource<Roles>();
  paginatorModel: PaginatorModel;
  paginatorModel1: PaginatorModel;

  invalid: boolean = false;
  systemServices: SelectBoxModel[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  languageForm: FormGroup;
  editingRoleId;
  UpdateOrAddBtnMessage: string = "Add Language";
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
    this.loadLanguage();

    this.initialForm();
  }

  initialForm(editData?:any): void {
    this.languageForm = this.fb.group({
      id: [editData?.id||this.id++],
      name: [editData?.name||"", Validators.required],
    });
  }
  id:any
  loadLanguage() {
    this.adminService.fetchAllLanguage(this.paginatorModel).subscribe({
      next: (responseData) => {
        debugger
        const data = responseData.result.data;
        this.dataSource.data =data;

        const elementWithMaxId = data.reduce((max, current) => {
  return current.id > max.id ? current : max;
}, data[0]);
this.id=elementWithMaxId.id
        this.length = responseData.result.count      },
    });
  }

  fillServicesSelectBox() {
    this.adminService.fetchAllLanguage(this.paginatorModel1).subscribe({
      next: (responseData) => {
        this.systemServices = responseData.result.data;
      },
    });
  }

  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    this.loadLanguage();
  }

  addLanguage() {
    if (this.languageForm.invalid) {
      this.invalid = true;
      return;
    }
   

    if (this.editingRoleId) {
      this.adminService.updateLanguage(this.languageForm.value).subscribe({
        next: (responseData) => {
          if (responseData.statusCode==200) {
            this.notificationService.showSuccess(
              responseData.messages
            );
            this.loadLanguage();
            this.editingRoleId = 0;
            this.UpdateOrAddBtnMessage = "Add Language";
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
    } else {
      this.adminService.addLanguage(this.languageForm.value).subscribe({
        next: (responseData) => {
          if (responseData.statusCode==200) {
            this.notificationService.showSuccess(
              responseData.messages
            );
            this.loadLanguage();
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
    }

    this.languageForm.reset();
  }

  editRole(roleData: Roles) {
   
    this.initialForm(roleData)
    this.editingRoleId = roleData.id;
    this.UpdateOrAddBtnMessage = "Update Language";
  }

  onRemoveRole(id: number) {
    this.saService.confirmDialog().then((result) => {
      if (result.isConfirmed) {
        this.adminService.removeLang(id).subscribe({
          next: (responseData) => {
            if (responseData.statusCode==200) {
              this.notificationService.showSuccess(
                responseData.messages
              );
              this.loadLanguage();
            } else {
              this.notificationService.showError("Any Error happened");
            }
          },
        });
      }
    });
  }

  // private formatRolesData(data: Roles[]): Roles[] {
  //   return data.map((role) => ({
  //     ...role,
  //     selectedSystemServicesString: role.selectedSystemServices.join(", "),
  //   }));
  // }
}
