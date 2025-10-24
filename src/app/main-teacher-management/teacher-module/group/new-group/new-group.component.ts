import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin.service';
import { OPERATION_MESSAGE } from 'src/app/shared/enums/api-enum';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent {
  paginatorModel: any;
  groupForm: FormGroup;
  roles = [];
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewGroupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: number;name: string; },
    private notificationService: NotificationService
  ) {
    this.paginatorModel = {
      count: 100,
      page: 1,
    };
  }
  ngOnInit(): void {
    this.initalForm();
  }

  initalForm(): void {
    this.groupForm = this.fb.group({
      id: [this.data?.id||null],
      name: [this.data?.name||"", Validators.required],
    });
  }

  onSetRole() {

    this.adminService.onAddGroup(this.groupForm.value).subscribe({
      next: (response) => {
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
  }

  onClose() {
    this.dialogRef.close({ result: false });
  }
}
