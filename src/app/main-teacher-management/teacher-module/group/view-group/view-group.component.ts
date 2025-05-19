import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AssignStudentComponent } from '../assign-student/assign-student.component';
import { AdminService } from 'src/app/services/admin.service';
import { AssignQuizzComponent } from '../assign-quizz/assign-quizz.component';
import { AssignContentComponent } from '../assign-content/assign-content.component';
// models/group-member.model.ts
export interface GroupMember {
  memberId: string;
  fullName: string;
  assignDate: string; // or Date if you'll convert it
}

// models/group-quiz.model.ts
export interface GroupQuiz {
  quizId: string;
  quizTitle: string;
  assignDate: string; // or Date
}

// models/group-content.model.ts
export interface GroupContent {
  contentId: string;
  contentName: string;
  assignDate: string; // or Date
}
@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss']
})
export class ViewGroupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AssignStudentComponent>,
    @Inject(MAT_DIALOG_DATA)
        public data: { groupId: string },
        private adminService: AdminService,
            public setRoleDialog: MatDialog,
        
  ) { }

  members: GroupMember[] = [];

  quizes: GroupQuiz[] = [];

  content: GroupContent[] = [
    {
      "contentId": "01948f05-c2d2-7542-8c41-2e600f5c459d",
      "contentName": "https://www.youtube.com/",
      "assignDate": "2025-02-09T13:05:45.022114Z"
    }
  ];
  ngOnInit() {
    this.getGroupDetailedData()
  }

  onClose() {
    this.dialogRef.close({ result: false });
  }

  getGroupDetailedData(){
    this.adminService.getAssignQuiz(this.data.groupId).subscribe({
      next: res => {
        this.quizes = res.result
      }
    });

    this.adminService.getByIdGroupMembers(this.data.groupId).subscribe({
      next: (res) => {
        this.members = res.result
      },
    });

    this.adminService.getAssignContent(this.data.groupId).subscribe({
      next: res => {
        this.content = res.result
      }
    });
  }

    onSetNewStudent() {
      let dialogRef = this.setRoleDialog.open(AssignStudentComponent, {
        width: "50%",
      maxHeight: "90vh",
        data: { userId: this.data.groupId },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getGroupDetailedData();
        }
      });
    }
  
    assignQuizz(){
      let dialogRef = this.setRoleDialog.open(AssignQuizzComponent, {
        maxHeight: "95vh",
        width: "50%",
        data: { groupId: this.data.groupId},
      });
  
      dialogRef.afterClosed().subscribe((result) => {
          this.getGroupDetailedData();
      });
    }
  
    assignContent(){
      let dialogRef = this.setRoleDialog.open(AssignContentComponent, {
        maxHeight: "95vh",
        width: "50%",
        data: { groupId: this.data.groupId},
      });
      dialogRef.afterClosed().subscribe((result) => {
          this.getGroupDetailedData();
      });
    }

}
