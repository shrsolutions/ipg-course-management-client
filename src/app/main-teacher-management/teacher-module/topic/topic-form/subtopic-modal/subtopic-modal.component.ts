import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { PaginatorModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";
import {
  SubtopicForm,
  SubtopicList,
} from "src/app/main-teacher-management/models/library-models/subtopic";
import { AdminService } from "src/app/services/admin.service";
import { LibraryService } from "src/app/services/library.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";
import { AssignQuizzForSubtopicComponent } from "./assign-quizz-for-subtopic/assign-quizz-for-subtopic.component";
import { showConfirmAlert } from "src/app/shared/helper/alert";

@Component({
  selector: "app-subtopic-modal",
  templateUrl: "./subtopic-modal.component.html",
  styleUrls: ["./subtopic-modal.component.scss"],
})
export class SubtopicModalComponent implements OnInit, AfterContentChecked {
  dataSource: MatTableDataSource<SubtopicList> = new MatTableDataSource<
    SubtopicList
  >();

  categoryId = 0;
  editedSubject;
  paginatorModel: PaginatorModel
  displayedColumns: string[] = [
    "translation",
    "edit",
  ];
  editingSubtopciId: number = 0;
  subtopicForm: FormGroup;
  UpdateOrAddBtnMessage = "Add Subtopic";
  constructor(
    private libraryService: LibraryService,
    public dialogRef: MatDialogRef<SubtopicModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { topicId: string },
    private adminService: AdminService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
        public setRoleDialog: MatDialog,
    
  ) {
    this.paginatorModel = {
      count: 100,
      page: 1,
    };
  }

  ngOnInit(): void {
    this.onLoadSubtopics();
    this.initForm();
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges()
  }

  initForm(): void {
    this.subtopicForm = this.fb.group({
      subtopic: ["", [Validators.required, Validators.maxLength(100)]], // Adjust max length as needed
    });
  }
  onLoadSubtopics() {
    this.libraryService.fetchSubTopicsByTopicId(this.data.topicId, this.paginatorModel).subscribe({
      next: (response) => {
        const responseData = response.result.data;
        this.dataSource.data = responseData;
      },
    });
  }

  onClose() {
    this.dialogRef.close({ result: false });
  }

  onSubmit() {
    if (this.subtopicForm.valid) {
      const subtopicValue: any = {
        translation: {
          languageId: 1,
          translation: this.subtopicForm.get("subtopic").value,
        },
        id: this.editingSubtopciId || null,
        topicId: this.data.topicId,
      };

      this.adminService.onAddSubtopic(subtopicValue).subscribe({
        next: (response) => {
          if (response.statusCode == 200) {
            this.notificationService.showSuccess(
              response.messages
            );
            this.editingSubtopciId = 0;
            this.UpdateOrAddBtnMessage = "Add Subtopic";
            this.onLoadSubtopics();
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
    } else {
      // Mark form controls as touched to display validation messages
      this.subtopicForm.markAllAsTouched();
    }
  }

  onEditSubtopic(subtopic): void {
    this.subtopicForm.patchValue({
      subtopic: subtopic.translationInCurrentLanguage,
    });

    this.editingSubtopciId = subtopic.id;
    this.UpdateOrAddBtnMessage = "Update Subtopic";
  }

  onRemoveSubtopic(subtopicId: number, languageId: number): void {
    // this.adminService.onRemoveSubtopic(subtopicId, languageId).subscribe({
    //   next: (response) => {
    //     if (response.statusCode == 200) {
    //       this.notificationService.showSuccess(
    //         response.messages
    //       );
    //       this.onLoadSubtopics();
    //     } else {
    //       this.notificationService.showError("Any Error happened");
    //     }
    //   },
    // });
    showConfirmAlert('Delete selected row?', '', 'Delete', `Close`).then((result) => {
      if (result.isConfirmed) {
        this.adminService.onRemoveSubtopic(subtopicId).subscribe({
          next: (responseData) => {
            if (responseData.statusCode == 200) {
              this.notificationService.showSuccess(responseData.messages);
              this.onLoadSubtopics();
            } else {
              this.notificationService.showError(responseData.messages);
            }
          },
        });
      }
    })
  }

    assignQuizz(subtopicId: number){
      let dialogRef = this.setRoleDialog.open(AssignQuizzForSubtopicComponent, {
        maxHeight: "95vh",
        width: "50%",
        data: { subtopicId: subtopicId},
      });
  
      dialogRef.afterClosed().subscribe((result) => {
          this.onLoadSubtopics();
      });
    }
}
