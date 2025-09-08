import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import {
  VideoLinkList
} from "src/app/main-teacher-management/models/library-models/video-link";
import { AdminService } from "src/app/services/admin.service";
import { LibraryService } from "src/app/services/library.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";
import { HttpResponse } from "@angular/common/http";
import { AssignQuizzForSubtopicComponent } from "../../topic/topic-form/subtopic-modal/assign-quizz-for-subtopic/assign-quizz-for-subtopic.component";
import { MatDialog } from "@angular/material/dialog";
import { showConfirmAlert } from "src/app/shared/helper/alert";
@Component({
  selector: "app-video-form",
  templateUrl: "./video-form.component.html",
  styleUrls: ["./video-form.component.scss"],
})
export class VideoFormComponent implements OnInit {
  Yes = true;
  videoForm: FormGroup;
  subtopicId: number;
  editingVideoId: 0;
  subjectId: number;
  displayedColumns: string[] = ["value", "name", "description", "delete"];
  dataSource: MatTableDataSource<VideoLinkList> = new MatTableDataSource<
    VideoLinkList
  >();

  invalid: boolean = true;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private notificationService: NotificationService,
    private libraryService: LibraryService,
    public setRoleDialog: MatDialog,
  ) { }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subtopicId = params["id"];
      this.onLoadVideos(this.subtopicId);
    });
    this.initForm();
  }

  initForm() {
    this.videoForm = this.fb.group({
      attachmentTypeId: [true ?2:1],
      id: [""],
      languageId: [1],
      name: ["", Validators.required],
      value: ["", Validators.required],
      subtopicAttachmentFile: [0 , Validators.required],
      description: [""],
      subtopicId: [this.subtopicId],

    });
  }

  onDownloadFile(id: number) {
    this.adminService.onDownloadAttachment(id).subscribe((blob) => {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.target = "_blank";
      // Append the link to the document and trigger a click event to start the download
      document.body.appendChild(link);
      link.click();
      link.download = "file";

      // Remove the link from the document
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    });
  }

  enableCheckboxValidator() {
    return this.videoForm && this.videoForm.get("attachmentTypeId").value
      ? Validators.required
      : null;
  }
  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files[0];
    this.videoForm.patchValue({
      subtopicAttachmentFile: file,
    });
  }

  onLoadVideos(subtopicId: number): void {
    if (subtopicId != null && subtopicId !== undefined) {
      this.libraryService.fetchAttachmentsBySubtopicId(subtopicId).subscribe({
        next: (response) => {
          const data = response.result;
          this.dataSource.data = data;
        },
      });
    }
  }

  getVideoById(row: any) {
    this.videoForm.patchValue(row)
    if (row.attachmentTypeId == 1) {
      this.videoForm.controls['attachmentTypeId'].patchValue(false)
    }else{
      this.videoForm.controls['attachmentTypeId'].patchValue(true)
    }
    
  }

  onSubmit() {
    if (
      (!this.videoForm.get("attachmentTypeId").value &&this.videoForm.get("subtopicAttachmentFile").valid) ||(this.videoForm.get("attachmentTypeId").value && this.videoForm.get("value").valid)
    ) {

      this.videoForm.controls['attachmentTypeId'].patchValue(this.videoForm.controls['attachmentTypeId'].value ? 2 : 1)
      this.adminService.onAddVideoAttachment(this.subtopicId, this.videoForm.value).subscribe({
        next: (response) => {
          if (response.statusCode == 200) {
            this.notificationService.showSuccess(
              response.messages
            );

            this.onLoadVideos(this.subtopicId);
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });

      this.initForm()
    } else {
      this.invalid = false;
      // Mark form controls as touched to display validation messages
      this.videoForm.markAllAsTouched();
    }
  }

  assignQuizz() {
    let dialogRef = this.setRoleDialog.open(AssignQuizzForSubtopicComponent, {
      maxHeight: "95vh",
      width: "50%",
      data: { subtopicId: this.subtopicId, type: "view" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.onLoadVideos(this.subtopicId);
    });
  }

  onRemoveVideo(videoId: string) {
    showConfirmAlert('Delete selected row?', '', 'Delete', `Close`).then((result) => {
      if (result.isConfirmed) {
        this.adminService.onRemoveVideo(this.subtopicId, videoId).subscribe({
          next: (responseData) => {
            if (responseData.statusCode == 200) {
              this.notificationService.showSuccess(
                responseData.messages
              );
              this.onLoadVideos(this.subtopicId);

            } else {
              this.notificationService.showError("Any Error happened");
            }
          },
        });
      }
    })
  }


}
