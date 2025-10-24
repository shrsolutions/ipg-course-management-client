import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminService } from "src/app/services/admin.service";
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
  subjectList: any[] = [];
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
    "subject",
    "edit",
    "remove",
  ];
  filters = {
    name: '',
    surname : '',
    email  : '',
    phone: '',
    subject:'',

  };
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
    this.dataSource.filterPredicate = this.createFilter();

  }
  ngOnInit(): void {
    this.initForm();
    this.getAllCategories();
    this.loadLanguage()
    this.dataSource.filterPredicate = this.createFilter();


  }
  createFilter(): (data: any, filter: string) => boolean {

    return (data, filter): boolean => {
      const searchTerms = JSON.parse(filter);
      const isNameMatching = !searchTerms.name || data.name?.toLowerCase().includes(searchTerms.name.toLowerCase());
      const isSurnameMatching = !searchTerms.surname || data.surname?.toLowerCase().includes(searchTerms.surname.toLowerCase());
      const isEmailMatching = !searchTerms.email || data.email?.toLowerCase().includes(searchTerms.email.toLowerCase());
      const isPhoneMatching = !searchTerms.phone || data.phone?.toLowerCase().includes(searchTerms.phone.toLowerCase());
      const isSubjectMatching = !searchTerms.subject || data.subject?.toLowerCase().includes(searchTerms.subject.toLowerCase());

      return isNameMatching && isSurnameMatching && isEmailMatching && isPhoneMatching && isSubjectMatching;

    };
  }
  applyFilterColumn() {


    const filterValues = JSON.stringify(this.filters);
    this.dataSource.filter = filterValues;
  }
  initForm(): void {
    this.studentForm = this.fb.group({
      id: [0, Validators.required],
      name: ["", [Validators.required, Validators.maxLength(50)]],
      surname: ["", [Validators.required, Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.maxLength(50)]],
      phone: ["", [Validators.required, Validators.maxLength(50)]],
      subject: ["", [Validators.required, Validators.maxLength(50)]],


    });
  }

  getAllCategories(): void {
    this.libraryService.fetchAllCategories(this.paginatorModel).subscribe({
      next: (response) => {
        this.subjectList=response.result.data
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

  }

  onRemoveStudent(studentId: number) {


  }
  languages:any
  loadLanguage() {
    this.adminService.fetchAllLanguage(this.paginatorModel).subscribe({
      next: (responseData) => {

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
