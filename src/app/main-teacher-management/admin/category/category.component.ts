import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminService } from "src/app/services/admin.service";
import { Category, CategoryResult } from "../models/category";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";
import { LibraryService } from "src/app/services/library.service";
import { SweatAlertService } from "src/app/shared/services/sweat-alert.service";
import { PaginatorModel } from "../../models/Base/FetchBaseModel";
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { showConfirmAlert } from "src/app/shared/helper/alert";
import { MatDialog } from "@angular/material/dialog";
import { AssignQuizzToSubtopicComponent } from "../../teacher-module/quizzes/assign-quizz-to-subtopic/assign-quizz-to-subtopic.component";
import { NewCategoryComponent } from "./new-category/new-category.component";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categoryList: any[] = [];
  editedCategoryId = 0;
  btnAddOrUpdate: string = "Add Category";
  pageSize = 5;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [

    "name",
    "edit",
    "remove",
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  paginatorModel: PaginatorModel;
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notificationService: NotificationService,
    private libraryService: LibraryService,
       public openMatDialog: MatDialog,
   
  ) {
    this.paginatorModel = {
      count: this.pageSize,
      page: this.currentPage,
    };
  }
  ngOnInit(): void {
    this.initForm();
    this.getAllCategories();
    this.loadLanguage()

  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      langId: [0, Validators.required],
      category: ["", [Validators.required, Validators.maxLength(50)]],
    });
  }

  getAllCategories(): void {
    this.libraryService.fetchAllCategories(this.paginatorModel).subscribe({
      next: (response) => {
        this.categoryList = response.result.data
        const data = response.result.data;
        this.dataSource.data = data;
        this.length = response.result.count
      },
    });
  }

  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    this.getAllCategories();
  }

  onEditCategory(id: any): void {
    console.log(id)
    let dialogRef = this.openMatDialog.open(NewCategoryComponent, {
      maxHeight: "95vh",
      width: "40%",
      data: { categoryID: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
            this.getAllCategories();
    });
  }

  onRemoveCategory(categoryId: number) {

    showConfirmAlert('Delete selected row?', '', 'Delete', `Close`).then((result) => {
      if (result.isConfirmed) {
        this.adminService.onRemoveCategory(categoryId).subscribe({
          next: (responseData) => {
            if (responseData.statusCode == 200) {
              this.notificationService.showSuccess(responseData.messages);
              this.getAllCategories();
            } else {
              this.notificationService.showError(responseData.messages);
            }
          },
        });
      }
    })

    


  }
  languages: any
  loadLanguage() {
    this.adminService.fetchAllLanguage(this.paginatorModel).subscribe({
      next: (responseData) => {

        const data = responseData.result.data;
        this.languages = data;
      },
    });
  }


  openDialog() {
    let dialogRef = this.openMatDialog.open(NewCategoryComponent, {
      maxHeight: "95vh",
      width: "40%",
      data: { categoryID: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
            this.getAllCategories();
    });
  }
}
