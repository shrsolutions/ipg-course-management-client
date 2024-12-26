import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PaginatorModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";
import { AdminService } from "src/app/services/admin.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";

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
    this.fillRoleSelectBox();
    this.initalForm();
  }
  editdata:any
  initalForm() {
    debugger
    this.studentForm = this.fb.group({
      role: [this.editdata||"", Validators.required],
    });
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
  fillRoleSelectBox() {
    this.adminService.fetchRoles(this.paginatorModel).subscribe({
      next: (response) => {
        this.roles = response.result.data;

          // let [ids] = this.data.roleIds;
          // console.log(this.data.roleIds);
          debugger
          const matches = this.roles.filter(item => this.data.roleIds.includes(item.name));

          // Uyğun `key`-ləri götürmək üçün `map` istifadə edirik
          const keys = matches.map(item => item.id);
          this.editdata=keys
          this.initalForm()
      },
    });
  }

  addStudent() {
    debugger
    let model={
      roleIds:this.studentForm.get("role").value
    }
    const roleData = Array.from(this.studentForm.get("role").value).map(
      (roleIds) => ({
        roleIds,
      })
    );

    this.adminService.onSetNewRoleToUser(this.data.userId, model).subscribe({
      next: (response) => {
        if (response.statusCode==200) {
          this.notificationService.showSuccess(
            response.messages
          );

          this.dialogRef.close({ result: true });
        } else {
          this.notificationService.showError("Any Error happened");
        }
      },
    });
  }

  onClose() {
    this.dialogRef.close({ result: false });
  }
}
