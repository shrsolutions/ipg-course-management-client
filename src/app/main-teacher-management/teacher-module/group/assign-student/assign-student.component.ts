import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { map, Observable, startWith } from "rxjs";
import { PaginatorModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";
import { AdminService } from "src/app/services/admin.service";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: 'app-assign-student',
  templateUrl: './assign-student.component.html',
  styleUrls: ['./assign-student.component.scss']
})

export class AssignStudentComponent {
  paginatorModel: PaginatorModel;
  roleForm: FormGroup;
  students: any = [];
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssignStudentComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { userId: number },
    private notificationService: NotificationService,
  ) {
    this.paginatorModel = {
      count: 100,
      page: 1,
    };
  }

  ngOnInit(): void {
    this.initalForm()
    this.fillstudentselectBox();
    this.getbyIdForMembers()
  }
  editdata: any[] = []
  initalForm() {

    this.roleForm = this.fb.group({
      memberIds: [this.editdata[0] || [], Validators.required],
    });
  }

  getbyIdForMembers() {

    this.adminService.getByIdGroupMembers(this.data.userId).subscribe({
      next: (response) => {
        if (response.statusCode == 200) {
          let model: any[] = []

          for (let index = 0; index < response.result?.length; index++) {
            model.push(response.result[index].memberId)
          }

          this.editdata.push(model)
          this.initalForm()
        } else {
          this.notificationService.showError("Any Error happened");
        }
      },
    });
  }
  selectedOptions = [];
  handleAutocomp(filter: string) {
    this.lastFilter = filter;

    if (filter.length > 0) {
      this.adminService.autocompleteWithFilter(filter).subscribe({
        next: (res) => {
          this.students = res.result;
        },
      });
    }

  }
  fillstudentselectBox() {
    this.adminService.autocomplete().subscribe({
      next: (response) => {
        this.students = response.result;
        this.initalForm()
      },
    });
  }

  onSetRole() {

    if (this.roleForm.invalid) {
      return;
    }

    this.adminService.onAddMembers(this.data.userId, this.roleForm.value).subscribe({
      next: (response) => {
        if (response.statusCode == 200) {
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
  displayVal(object: any) {
    return (object && object.value) || '';
  }
  onClose() {
    this.dialogRef.close({ result: false });
  }

  filteredUsers: Observable<any[]>;
  lastFilter: string = '';

  visible = true;

}
