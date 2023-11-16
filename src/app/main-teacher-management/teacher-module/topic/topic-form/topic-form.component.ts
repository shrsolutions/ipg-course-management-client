import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import {
  TopicForm,
  TopicList,
} from "src/app/main-teacher-management/models/library-models/topic";
import { AdminService } from "src/app/services/admin.service";
import { LibraryService } from "src/app/services/library.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";
import { SubtopicModalComponent } from "./subtopic-modal/subtopic-modal.component";

@Component({
  selector: "app-topic-form",
  templateUrl: "./topic-form.component.html",
  styleUrls: ["./topic-form.component.scss"],
})
export class TopicFormComponent {
  subjectId: number;
  displayedColumns: string[] = [
    "topicId",
    "translation",
    "languageName",
    "setSubtopic",
  ];
  dataSource: MatTableDataSource<TopicList> = new MatTableDataSource<
    TopicList
  >();
  topicForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private notificationService: NotificationService,
    public setSubtopicDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subjectId = +params["id"];
      this.onLoadSubject(this.subjectId);
    });

    this.initForm();
  }

  initForm(): void {
    this.topicForm = this.fb.group({
      topic: ["", [Validators.required, Validators.maxLength(100)]],
    });
  }

  onLoadSubject(subjectId: number): void {
    if (subjectId != null && subjectId !== undefined) {
      this.libraryService.fetchTopicsBySubjectId(subjectId).subscribe({
        next: (response) => {
          const data = response.result;
          this.dataSource.data = data;
        },
      });
    }
  }

  onSubmit() {
    if (this.topicForm.valid) {
      const topicName = this.topicForm.get("topic").value;
      const topicValue: TopicForm = {
        languageId: 1,
        translation: topicName,
        subjectId: this.subjectId,
        topicId: 0,
      };
      this.adminService.onAddTopic(topicValue).subscribe({
        next: (response) => {
          if (response.messages.includes(OPERATION_MESSAGE.success)) {
            this.notificationService.showSuccess("Topic added succesfully");
            this.onLoadSubject(this.subjectId);
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
    } else {
      // Mark form controls as touched to display validation messages
      this.topicForm.markAllAsTouched();
    }
  }

  onSetSubTopic(topicId: number): void {
    console.log(topicId);
    this.setSubtopicDialog.open(SubtopicModalComponent, {
      height: "300px",
      width: "700px",

      data: { topicId: topicId },
    });
  }
}
