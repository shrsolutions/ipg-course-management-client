import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import {
  VideoLinkList,
  videoLinkForm,
} from "src/app/main-teacher-management/models/library-models/video-link";
import { AdminService } from "src/app/services/admin.service";
import { LibraryService } from "src/app/services/library.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";
import { saveAs } from "file-saver";
import { HttpResponse } from "@angular/common/http";
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
  displayedColumns: string[] = ["id", "value", "description"];
  dataSource: MatTableDataSource<VideoLinkList> = new MatTableDataSource<
    VideoLinkList
  >();

  invalid: boolean = true;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private notificationService: NotificationService,
    private libraryService: LibraryService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subtopicId = params["id"];
      this.onLoadVideos(this.subtopicId);
    });
    this.initForm();
  }

  initForm() {
    this.videoForm = this.fb.group({
      enableCheckbox: [true],
      videoLink: ["", Validators.required],
      videoFile: [null, Validators.required],
      description: [""],
    });
  }

  onDownloadFile(id: number) {
    this.adminService.onDownloadAttachment(id).subscribe((blob) => {
      console.log(blob);
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
    return this.videoForm && this.videoForm.get("enableCheckbox").value
      ? Validators.required
      : null;
  }
  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files[0];
    this.videoForm.patchValue({
      videoFile: file,
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
  onSubmit() {
    debugger;
    if (
      (!this.videoForm.get("enableCheckbox").value &&
        this.videoForm.get("videoFile").valid) ||
      (this.videoForm.get("enableCheckbox").value &&
        this.videoForm.get("videoLink").valid)
    ) {
      const subtopicValue: videoLinkForm = {
        languageId: 1,
        AttachmentTypeId: this.videoForm.get("enableCheckbox").value ? 2 : 1,
        value: this.videoForm.get("videoLink").value,
        subtopicId: this.subtopicId,
        description: this.videoForm.get("description").value,
        subtopicAttachmentFile: this.videoForm.get("videoFile").value||0,
        id: 0,
      };
      this.adminService.onAddVideoAttachment(this.subtopicId, subtopicValue).subscribe({
        next: (response) => {
          if (response.messages.includes(OPERATION_MESSAGE.success)) {
            this.notificationService.showSuccess(
              `Topic ${this.editingVideoId ? "Updated" : "Added"} successfully`
            );

            this.onLoadVideos(this.subtopicId);
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });

      this.videoForm.reset();
    } else {
      this.invalid = false;
      // Mark form controls as touched to display validation messages
      this.videoForm.markAllAsTouched();
    }
  }
}
