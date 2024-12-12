import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminService } from "src/app/services/admin.service";
import { Category, CategoryResult } from "../models/category";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";
import { LibraryService } from "src/app/services/library.service";
import { SweatAlertService } from "src/app/shared/services/sweat-alert.service";
import { PaginatorModel } from "../../models/Base/FetchBaseModel";

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
  paginatorModel: PaginatorModel;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notificationService: NotificationService,
    private libraryService: LibraryService,
    private saService: SweatAlertService
  ) {
    this.paginatorModel = {
      count: 100,
      page: 1,
    };
  }
  ngOnInit(): void {
    this.initForm();
    this.getAllCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      category: ["", [Validators.required, Validators.maxLength(50)]],
    });
  }

  getAllCategories(): void {
    this.libraryService.fetchAllCategories(this.paginatorModel).subscribe({
      next: (response) => {
        this.categoryList = response.result.data;
      },
    });
  }

  onEditCategory(id: number): void {
    const editedCategory = this.categoryList.find((c) => c.id === id);
    if (!editedCategory) return;
    this.editedCategoryId = editedCategory.id;
    this.categoryForm.patchValue({
      category: editedCategory.translationInCurrentLanguage,
    });
    this.btnAddOrUpdate = "Update Category";
  }

  onRemoveCategory(categoryId: number, languageId: number) {
    this.saService.confirmDialog().then((result) => {
      if (result.isConfirmed) {
        this.adminService.onRemoveCategory(categoryId, languageId).subscribe({
          next: (responseData) => {
            if (responseData.statusCode==200) {
              this.notificationService.showSuccess(
                responseData.messages
              );
              this.getAllCategories();
            } else {
              debugger
              this.notificationService.showError(  responseData.messages);
            }
          },
        });
      }
    });
  }
  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryValue = this.categoryForm.get("category").value;
      const categoryData: any = {
        id: this.editedCategoryId || null,
        translation: {
          languageId:1,
          translation: categoryValue,

        },
      };

      this.adminService.onAddCategory(categoryData).subscribe({
        next: (response) => {
          if (response.statusCode==200) {
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
