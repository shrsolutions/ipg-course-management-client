import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-video-form",
  templateUrl: "./video-form.component.html",
  styleUrls: ["./video-form.component.scss"],
})
export class VideoFormComponent implements OnInit {
  Yes = true;
  videoForm: FormGroup;
  subtopicId: number;
  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subtopicId = +params["id"];
    });
    this.initForm();
  }

  initForm() {
    this.videoForm = this.fb.group({
      enableCheckbox: [1],
      videoLink: ["", Validators.required],
      videoFile: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.videoForm.valid) {
      // const subtopicValue: SubtopicForm = {
      //   languageId: 1,
      //   translation: this.subtopicForm.get("subtopic").value,
      //   subtopicId: this.editingRoleId || 0,
      //   topicId: this.data.topicId,
      // };
      // this.adminService.onAddSubtopic(subtopicValue).subscribe({
      //   next: (response) => {
      //     if (response.messages.includes(OPERATION_MESSAGE.success)) {
      //       this.notificationService.showSuccess(
      //         `Topic ${this.editingRoleId ? "Updated" : "Added"} successfully`
      //       );
      //       this.editingRoleId = 0;
      //       this.UpdateOrAddBtnMessage = "Add Subtopic";
      //       this.onLoadSubtopics();
      //     } else {
      //       this.notificationService.showError("Any Error happened");
      //     }
      //   },
      // });
    } else {
      // Mark form controls as touched to display validation messages
      this.videoForm.markAllAsTouched();
    }
  }
}
