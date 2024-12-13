import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SubjectList } from "../../models/subject";
import { LibraryService } from "src/app/services/library.service";
import { PaginatorModel, SelectBoxModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";
import { MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "src/app/services/admin.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-subject-list",
  templateUrl: "./subject-list.component.html",
  styleUrls: ["./subject-list.component.scss"],
})
export class SubjectListComponent implements OnInit {
  dataSource: MatTableDataSource<SubjectList> = new MatTableDataSource<
    SubjectList
  >();
  categories: SelectBoxModel[] = [];
  categoryId = 0;
  editedSubject;

  displayedColumns: string[] = [
    "subjectId",
    "translation",
    "languageName",
    "remove",
  ];
  paginatorModel: PaginatorModel;

  constructor(
    private libraryService: LibraryService,
    public dialogRef: MatDialogRef<SubjectListComponent>,
    private adminService: AdminService,
    private notificationService: NotificationService
  ) {
    this.paginatorModel = {
      count: 100,
      page: 1,
    };
  }
  ngOnInit(): void {
    this.fillCategorySelectBox();
  }

  fillCategorySelectBox() {
    this.libraryService.fetchAllCategories(this.paginatorModel).subscribe({
      next: ({ result }) => {
        this.categories = result.data.map((v) => ({
          key: v.id,
          value: v.translationInCurrentLanguage,
        }));
      },
    });
  }
  onLoadSubject(categoryId: number): void {
    this.libraryService.fetchSubjectsByCategoryId(categoryId,this.paginatorModel).subscribe({
      next: (responseData) => {
        const data = responseData.result.data;
        this.dataSource.data = data;
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }
  onRemoveSubject(subjectId: number, languageId: number): void {
    this.adminService.onRemoveSubject(subjectId, languageId).subscribe({
      next: (response) => {
        if (response.statusCode==200) {
          this.notificationService.showSuccess(
            response.messages
          );
          this.onLoadSubject(this.categoryId);
        } else {
          this.notificationService.showError("Any Error happened");
        }
      },
    });
  }
}
