import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignStudentComponent } from '../assign-student/assign-student.component';
import { AdminService } from 'src/app/services/admin.service';
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

}
