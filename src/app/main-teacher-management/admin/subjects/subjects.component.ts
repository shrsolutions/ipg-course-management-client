import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "../models/subject";
import { AdminService } from "src/app/services/admin.service";
import { SelectBoxModel } from "../../models/Base/FetchBaseModel";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";
import { LibraryService } from "src/app/services/library.service";
import { MatDialog } from "@angular/material/dialog";
import { SubjectListComponent } from "./subject-list/subject-list.component";

@Component({
  selector: "app-subjects",
  templateUrl: "./subjects.component.html",
  styleUrls: ["./subjects.component.scss"],
})
export class SubjectsComponent implements OnInit {
  subjectForm: FormGroup;
  categories: SelectBoxModel[] = [];
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private libraryService: LibraryService,
    private notificationService: NotificationService,
    public subjectDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fillCategorySelectBox();
  }

  initForm(): void {
    this.subjectForm = this.fb.group({
      subject: ["", Validators.required],
      category: [null, Validators.required],
    });
  }

  fillCategorySelectBox() {
    this.libraryService.fetchAllCategories().subscribe({
      next: ({ result }) => {
        this.categories = result.map((v) => ({
          key: v.categoryId,
          value: v.translation,
        }));
      },
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      const subjectValue = this.subjectForm.get("subject").value;
      const subjectModel: Subject = {
        languageId: 1,
        categoryId: this.subjectForm.get("category").value,
        subjectId: 0,
        translation: subjectValue,
      };

      this.adminService.onAddSubject(subjectModel).subscribe({
        next: (response) => {
          if (response.messages.includes(OPERATION_MESSAGE.success)) {
            this.notificationService.showSuccess("Category added succesfully");
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
      this.subjectForm.reset();
    } else {
      Object.keys(this.subjectForm.controls).forEach((key) => {
        this.subjectForm.get(key)?.markAsTouched();
      });
    }
  }

  onShowSubjects(): void {
    let dialogRef = this.subjectDialog.open(SubjectListComponent, {
      height: "350px",
      width: "600px",
    });
  }
}
