import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import {
  TopicList,
} from "src/app/main-teacher-management/models/library-models/topic";
import { AdminService } from "src/app/services/admin.service";
import { LibraryService } from "src/app/services/library.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";
import { SubtopicModalComponent } from "./subtopic-modal/subtopic-modal.component";
import { PaginatorModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";

@Component({
  selector: "app-topic-form",
  templateUrl: "./topic-form.component.html",
  styleUrls: ["./topic-form.component.scss"],
})
export class TopicFormComponent {
  subjectId: number;
  displayedColumns: string[] = [
    "translation",
    "setSubtopic",
  ];
  dataSource: MatTableDataSource<TopicList> = new MatTableDataSource<
    TopicList
  >();
  paginatorModel: PaginatorModel;
  topicForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private notificationService: NotificationService,
    public setSubtopicDialog: MatDialog
  ) {
    this.paginatorModel = {
      count: 100,
      page: 1,
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subjectId = params["id"];
      this.onLoadTopics(this.subjectId);
    });

    this.initForm();
  }

  initForm(): void {
    this.topicForm = this.fb.group({
      topic: ["", [Validators.required, Validators.maxLength(100)]],
    });
  }

  onLoadTopics(subjectId: number): void {
    if (subjectId != null && subjectId !== undefined) {
      this.libraryService.fetchTopicsBySubjectId(subjectId,this.paginatorModel).subscribe({
        next: (response) => {
          const data = response.result.data;
          this.dataSource.data = data;
        },
      });
    }
  }

  onSubmit() {
    if (this.topicForm.valid) {
      const topicName = this.topicForm.get("topic").value;
      const topicValue: any = {
        id: null,
        subjectId: this.subjectId,
        translation:{
          languageId: 1,
          translation: topicName,
        },
      };
      this.adminService.onAddTopic(topicValue).subscribe({
        next: (response) => {
          if (response.statusCode==200) {
            this.notificationService.showSuccess(
              response.messages
            );
            this.onLoadTopics(this.subjectId);
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
    } else {
      this.topicForm.markAllAsTouched();
    }
  }

  onSetSubTopic(topicId: number): void {
    this.setSubtopicDialog.open(SubtopicModalComponent, {
      height: "300px",
      width: "700px",
      data: { topicId: topicId },
    });
  }
}
