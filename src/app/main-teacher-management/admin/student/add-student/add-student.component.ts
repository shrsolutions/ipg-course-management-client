import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PaginatorModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";
import { AdminService } from "src/app/services/admin.service";
import { LibraryService } from "src/app/services/library.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";
import { AuthService } from "src/app/user-auth/auth.service";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent {

  paginatorModel: PaginatorModel;
  studentForm: FormGroup;
  btnAddOrUpdate: string = "Add Student";

  roles = [];
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddStudentComponent>,
    private authService: AuthService,
   private libraryService: LibraryService,
    @Inject(MAT_DIALOG_DATA)
    public data: { userId: number; roleIds: [{ id: number }] },
    private notificationService: NotificationService
  ) {
    this.paginatorModel = {
      count: 100,
      page: 1,
    };
  }
  ngOnInit(): void {
    this.onLoadSubject('0193d0b1-bd3c-7576-ba80-1a567a5108c9');
    this.initalForm();
  }
  editdata:any
  initalForm() {
    debugger
    this.studentForm = this.fb.group({
      name: [this.editdata?.name||"", Validators.required],
      surname: [this.editdata?.surname||"", Validators.required],
      email: [this.editdata?.email||"", Validators.required],
      phone: [this.editdata?.phone||"", Validators.required],
      interestedSubjects: [this.editdata?.interestedSubjects||"", Validators.required],
      patronymic: ["", Validators.required],
      gender: ["", Validators.required],

      password: [
        "",
        (Validators.required),
      ],
    });
  }
  hidePassword = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  
  setFormDataToSelectBox() {
    // let [ids] = this.data.roleIds;
    // console.log(this.data.roleIds);
    debugger
    if (this.data && this.data.roleIds) {
const matches = this.roles.filter(item => this.data.roleIds.includes(item.name));

// Uyğun `key`-ləri götürmək üçün `map` istifadə edirik
const keys = matches.map(item => item.id);
this.editdata=keys

this.initalForm()
    //  this.studentForm.patchValue({
    //     role: found.key,
    //   });
    }
  }
  onLoadSubject(categoryId: any): void {
    this.libraryService.fetchSubjectsByCategoryId(categoryId,this.paginatorModel).subscribe({
      next: (responseData) => {
        this.roles = responseData.result.data;
      },
    });
  }

  // fillRoleSelectBox() {
  //   this.adminService.fetchRoles(this.paginatorModel).subscribe({
  //     next: (response) => {
  //       this.roles = response.result.data;

  //         // let [ids] = this.data.roleIds;
  //         // console.log(this.data.roleIds);
  //         debugger
  //         const matches = this.roles.filter(item => this.data.roleIds.includes(item.name));

  //         // Uyğun `key`-ləri götürmək üçün `map` istifadə edirik
  //         const keys = matches.map(item => item.id);
  //         this.editdata=keys
  //         this.initalForm()
  //     },
  //   });
  // }

  addStudent() {
    debugger
  
    
    this.authService.addStudent(this.studentForm.value).subscribe({
      next: (response) => {
        debugger
        if (response.statusCode==200) {
          this.notificationService.showSuccess(
            response.messages
          );
          this.dialogRef.close();
        } else {
          this.notificationService.showError("Any Error happened");
        }
      },
    });
    // this.adminService.onSetNewRoleToUser(this.data.userId, model).subscribe({
    //   next: (response) => {
    //     if (response.statusCode==200) {
    //       this.notificationService.showSuccess(
    //         response.messages
    //       );

    //       this.dialogRef.close({ result: true });
    //     } else {
    //       this.notificationService.showError("Any Error happened");
    //     }
    //   },
    // });
  }

  onClose() {
    this.dialogRef.close({ result: false });
  }
}
