import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PaginatorModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";
import { AdminService } from "src/app/services/admin.service";
import { OPERATION_MESSAGE } from "src/app/shared/enums/api-enum";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-set-new-role",
  templateUrl: "./set-new-role.component.html",
  styleUrls: ["./set-new-role.component.scss"],
})
export class SetNewRoleComponent implements OnInit {
  paginatorModel: PaginatorModel;
  roleForm: FormGroup;
  roles = [];
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SetNewRoleComponent>,
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
    this.setFormDataToSelectBox();
  }

  initalForm(): void {
    this.roleForm = this.fb.group({
      role: ["", Validators.required],
    });
  }

  setFormDataToSelectBox() {
    // let [ids] = this.data.roleIds;
    // console.log(this.data.roleIds);
    if (this.data && this.data.roleIds) {
      this.roleForm.patchValue({
        role: this.data.roleIds,
      });
    }
  }
  fillRoleSelectBox() {
    this.adminService.fetchRoles(this.paginatorModel).subscribe({
      next: (response) => {
        this.roles = response.result.data;
      },
    });
  }

  onSetRole() {
    debugger
    let model={
      roleIds:this.roleForm.get("role").value
    }
    const roleData = Array.from(this.roleForm.get("role").value).map(
      (roleIds) => ({
        roleIds,
      })
    );

    this.adminService.onSetNewRoleToUser(this.data.userId, model).subscribe({
      next: (response) => {
        if (response.messages.includes(OPERATION_MESSAGE.success)) {
          this.notificationService.showSuccess("Role set to user succesfully");
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
