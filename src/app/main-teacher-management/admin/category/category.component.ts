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
    private saService: SweatAlertService
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

    const editedCategory = this.categoryList.find((c) => c.id === id);
    if (!editedCategory) return;
    this.editedCategoryId = editedCategory.id;
    this.adminService.getByIdCategory(id).subscribe({
      next: (response) => {
        if (response.statusCode == 200) {
          const nonLanguageId1 = response.result.translations.find(
            translation => translation.languageId !== 1
          );
          this.categoryForm.patchValue({
            category: editedCategory.translationInCurrentLanguage,
            langId: nonLanguageId1 ? nonLanguageId1.languageId : 1
          });
        } else {

          this.notificationService.showError("Xəta baş verdi'");
        }
      },
      error: err => {

        this.notificationService.showError("Xəta baş verdi'");
      }

    });

    this.btnAddOrUpdate = "Update Category";
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

    // this.adminService.getByIdCategory(categoryId).subscribe({
    //   next: (response) => {
    //     if (response.statusCode==200) {
    //       const nonLanguageId1 = response.result.translations.find(
    //         translation => translation.languageId !== 1
    //     );
    //       this.adminService.onRemoveCategory(categoryId,nonLanguageId1 ? nonLanguageId1.languageId : 1).subscribe({
    //         next: (responseData) => {
    //           if (responseData.statusCode==200) {
    //             this.notificationService.showSuccess(
    //               responseData.messages
    //             );
    //             this.getAllCategories();
    //           } else {

    //             this.notificationService.showError("Bu əməliyyatı icra etmək hüququnuz yoxdur'");
    //           }
    //         }, error: err => {

    //           this.notificationService.showError("Bu əməliyyatı icra etmək hüququnuz yoxdur'");
    //         }
    //       });
    //       this.getAllCategories();
    //     } else {

    //       this.notificationService.showError("Bu əməliyyatı icra etmək hüququnuz yoxdur'");
    //     }
    //   },


    // });


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
  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryValue = this.categoryForm.get("category").value;
      const categoryData: any = {
        id: this.editedCategoryId || null,
        translation: {
          languageId: Number(this.categoryForm.get("langId").value),
          translation: categoryValue,

        },
      };

      this.adminService.onAddCategory(categoryData).subscribe({
        next: (response) => {
          if (response.statusCode == 200) {
            this.notificationService.showSuccess(
              response.messages
            );
            this.getAllCategories();
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
      this.categoryForm.reset();
      this.btnAddOrUpdate = "Add Category";
      this.editedCategoryId = 0;
    } else {
      // Mark all form controls as touched to show validation errors
      Object.keys(this.categoryForm.controls).forEach((key) => {
        this.categoryForm.get(key)?.markAsTouched();
      });
    }
  }
}
