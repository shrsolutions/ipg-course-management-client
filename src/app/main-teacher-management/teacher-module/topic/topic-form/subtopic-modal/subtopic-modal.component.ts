import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import {
  SubtopicForm,
  SubtopicList,
} from "src/app/main-teacher-management/models/library-models/subtopic";
import { AdminService } from "src/app/services/admin.service";
import { LibraryService } from "src/app/services/library.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-subtopic-modal",
  templateUrl: "./subtopic-modal.component.html",
  styleUrls: ["./subtopic-modal.component.scss"],
})
export class SubtopicModalComponent implements OnInit {
  dataSource: MatTableDataSource<SubtopicList> = new MatTableDataSource<
    SubtopicList
  >();

  categoryId = 0;
  editedSubject;

  displayedColumns: string[] = [
    "subtopicId",
    "translation",
    "languageName",
    "remove",
  ];

  subtopicForm: FormGroup;
  constructor(
    private libraryService: LibraryService,
    public dialogRef: MatDialogRef<SubtopicModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { topicId: number },
    private adminService: AdminService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.onLoadSubtopics();
    this.initForm();
  }

  initForm(): void {
    this.subtopicForm = this.fb.group({
      subtopic: ["", [Validators.required, Validators.maxLength(100)]], // Adjust max length as needed
    });
  }
  onLoadSubtopics() {
    this.libraryService.fetchSubTopicsByTopicId(this.data.topicId).subscribe({
      next: (response) => {
        const responseData = response.result;
        this.dataSource.data = responseData;
      },
    });
  }

  onClose() {
    this.dialogRef.close({ result: false });
  }

  onSubmit() {
    if (this.subtopicForm.valid) {
      const subtopicValue: SubtopicForm = {
        languageId: 1,
        translation: this.subtopicForm.get("subtopic").value,
        subtopicId: 0,
        topicId: this.data.topicId,
      };

      this.adminService.onAddSubtopic(subtopicValue).subscribe({
        next: (response) => {
          if (response.messages.includes(OPERATION_MESSAGE.success)) {
            this.notificationService.showSuccess("Topic added succesfully");
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
}
