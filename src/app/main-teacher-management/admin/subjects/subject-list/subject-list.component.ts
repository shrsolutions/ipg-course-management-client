import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SubjectList } from "../../models/subject";
import { LibraryService } from "src/app/services/library.service";
import { PaginatorModel, SelectBoxModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";
import { MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "src/app/services/admin.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { showConfirmAlert } from "src/app/shared/helper/alert";

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

    "translation",
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
    this.categoryId = categoryId
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
  onRemoveSubject(subjectId: number): void {
    // this.adminService.getByIdSubject(subjectId).subscribe({
    //   next: (response) => {
    //     if (response.statusCode==200) {
    //       const nonLanguageId1 = response.result.translations.find(
    //         translation => translation.languageId !== 1
    //     );
    //       this.adminService.onRemoveSubject(subjectId,nonLanguageId1 ? nonLanguageId1.languageId : 1).subscribe({
    //         next: (response) => {

    //           if (response.statusCode==200) {
    //             this.notificationService.showSuccess(
    //               response.messages
    //             );
    //             this.onLoadSubject(this.categoryId);
    //           } else {
    //             this.notificationService.showError("Any Error happened");
    //           }
    //         },
    //         error: err => {

    //           this.notificationService.showError("Bu əməliyyatı icra etmək hüququnuz yoxdur'");
    //         }

    //       });
    //     } else {
    //       this.notificationService.showError("Bu əməliyyatı icra etmək hüququnuz yoxdur'");
    //     }
    //   },
    // });

    showConfirmAlert('Delete selected row?', '', 'Delete', `Close`).then((result) => {
      if (result.isConfirmed) {
        this.adminService.onRemoveSubject(subjectId).subscribe({
          next: (responseData) => {
            if (responseData.statusCode == 200) {
              this.notificationService.showSuccess(responseData.messages);
              this.libraryService.fetchSubjectsByCategoryId(this.categoryId,this.paginatorModel).subscribe({
                next: (responseData) => {
                  const data = responseData.result.data;
                  this.dataSource.data = data;
                },
              });
            } else {
              this.notificationService.showError(responseData.messages);
            }
          },
        });
      }
    })

  }
}
