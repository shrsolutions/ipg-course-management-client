import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "../models/subject";
import { AdminService } from "src/app/services/admin.service";
import { PaginatorModel, SelectBoxModel } from "../../models/Base/FetchBaseModel";
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
  paginatorModel: PaginatorModel;


  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private libraryService: LibraryService,
    private notificationService: NotificationService,
    public subjectDialog: MatDialog
  ) {
    this.paginatorModel = {
      count: 100,
      page: 1,
    };
  }

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
    debugger
    this.libraryService.fetchAllCategories(this.paginatorModel).subscribe({
      next: ({ result }) => {
        this.categories = result.data.map((v) => ({
          key: v.id,
          value: v.translationInCurrentLanguage,
        }));
      },
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      const subjectValue = this.subjectForm.get("subject").value;
      const subjectModel: any = {
        categoryId: this.subjectForm.get("category").value,
        id: null,
        translation: {
          languageId: 1,
          translation:subjectValue
      }};

      this.adminService.onAddSubject(subjectModel).subscribe({
        next: (response) => {
          if (response.statusCode==200) {
            this.notificationService.showSuccess(
              response.messages
            );
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
