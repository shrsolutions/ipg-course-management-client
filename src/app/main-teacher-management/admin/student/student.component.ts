import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminService } from "src/app/services/admin.service";
import { Category, CategoryResult } from "../models/category";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";
import { LibraryService } from "src/app/services/library.service";
import { SweatAlertService } from "src/app/shared/services/sweat-alert.service";
import { PaginatorModel } from "../../models/Base/FetchBaseModel";
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { AddStudentComponent } from "./add-student/add-student.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent {
 studentForm: FormGroup;
  lessonList: any[] = [];
  editedstudentId = 0;
  btnAddOrUpdate: string = "Add Student";
  systemServices: any[] = [];

  pageSize = 5;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [

    "name",
    "surname",
    "email",
    "phone",
    "lesson",

    "edit",
    "remove",
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  paginatorModel: PaginatorModel;
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notificationService: NotificationService,
    private libraryService: LibraryService,
    private saService: SweatAlertService,
    public dialog: MatDialog,

  ) {
    this.paginatorModel = {
      count: this.pageSize,
      page: this.currentPage,
    };
  }
  ngOnInit(): void {
    this.initForm();
    this.getAllCategories();
    this.loadLanguage()

  }

  initForm(): void {
    this.studentForm = this.fb.group({
      id: [0, Validators.required],
      name: ["", [Validators.required, Validators.maxLength(50)]],
      surname: ["", [Validators.required, Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.maxLength(50)]],
      phone: ["", [Validators.required, Validators.maxLength(50)]],
      lesson: ["", [Validators.required, Validators.maxLength(50)]],


    });
  }

  getAllCategories(): void {
    this.libraryService.fetchAllCategories(this.paginatorModel).subscribe({
      next: (response) => {
        this.lessonList=response.result.data
        const data = response.result.data;
        this.dataSource.data =data;
        this.length = response.result.count
      },
    });
  }

  onPageChanged(event: PageEvent) {
    this.paginatorModel.page = event.pageIndex + 1;
    this.paginatorModel.count = event.pageSize;
    this.getAllCategories();
  }
 addStudent(id: number,name?:any) {
    let dialogRef = this.dialog.open(AddStudentComponent, {
      height: "470px",
      width: "600px",
      data: { id: id,name:name },
    });

    dialogRef.afterClosed().subscribe((result) => {
        this.getAllCategories();

    });
  }
  onEditStudent(id: any): void {
    debugger
    const editedstudent = this.lessonList.find((c) => c.id === id);
    if (!editedstudent) return;
    this.editedstudentId = editedstudent.id;
    this.adminService.getByIdCategory(id).subscribe({
      next: (response) => {
        if (response.statusCode==200) {
          const nonLanguageId1 = response.result.translations.find(
            translation => translation.languageId !== 1
        );
        this.studentForm.patchValue({
          category: editedstudent.translationInCurrentLanguage,
          langId:nonLanguageId1 ? nonLanguageId1.languageId : 1
        });
        } else {
          debugger
          this.notificationService.showError("Xəta baş verdi'");
        }
      },
      error: err => {
        debugger
        this.notificationService.showError("Xəta baş verdi'");
      }

    });

    this.btnAddOrUpdate = "Update Student";
  }

  onRemoveStudent(studentId: number) {
    debugger

        this.adminService.getByIdCategory(studentId).subscribe({
          next: (response) => {
            if (response.statusCode==200) {
              const nonLanguageId1 = response.result.translations.find(
                translation => translation.languageId !== 1
            );
              this.adminService.onRemoveCategory(studentId,nonLanguageId1 ? nonLanguageId1.languageId : 1).subscribe({
                next: (responseData) => {
                  if (responseData.statusCode==200) {
                    this.notificationService.showSuccess(
                      responseData.messages
                    );
                    this.getAllCategories();
                  } else {
                    debugger
                    this.notificationService.showError("Bu əməliyyatı icra etmək hüququnuz yoxdur'");
                  }
                }, error: err => {
                  debugger
                  this.notificationService.showError("Bu əməliyyatı icra etmək hüququnuz yoxdur'");
                }
              });
              this.getAllCategories();
            } else {
              debugger
              this.notificationService.showError("Bu əməliyyatı icra etmək hüququnuz yoxdur'");
            }
          },


        });


  }
  languages:any
  loadLanguage() {
    this.adminService.fetchAllLanguage(this.paginatorModel).subscribe({
      next: (responseData) => {
        debugger
        const data = responseData.result.data;
        this.languages =data;
 },
    });
  }
  onSubmit(): void {
    if (this.studentForm.valid) {
      const categoryValue = this.studentForm.get("category").value;
      const categoryData: any = {
        id: this.editedstudentId || null,
        translation: {
          languageId: Number(this.studentForm.get("langId").value),
          translation: categoryValue,

        },
      };

      this.adminService.onAddCategory(categoryData).subscribe({
        next: (response) => {
          if (response.statusCode==200) {
            this.notificationService.showSuccess(
              response.messages
            );
            this.getAllCategories();
          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });
      this.studentForm.reset();
      this.btnAddOrUpdate = "Add Student";
      this.editedstudentId = 0;
    } else {
      // Mark all form controls as touched to show validation errors
      Object.keys(this.studentForm.controls).forEach((key) => {
        this.studentForm.get(key)?.markAsTouched();
      });
    }
  }
}
