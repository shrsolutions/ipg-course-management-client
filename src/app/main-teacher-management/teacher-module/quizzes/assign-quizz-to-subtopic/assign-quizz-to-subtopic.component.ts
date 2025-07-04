import { Component, Inject, OnInit } from '@angular/core';
import { NewQuizComponent } from '../new-quiz/new-quiz.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-quizz-to-subtopic',
  templateUrl: './assign-quizz-to-subtopic.component.html',
  styleUrls: ['./assign-quizz-to-subtopic.component.scss']
})
export class AssignQuizzToSubtopicComponent implements OnInit {

  constructor(
        public dialogRef: MatDialogRef<NewQuizComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { quizId: string },
  ) { }

  ngOnInit() {
    console.log(this.data.quizId)
  }

  assignToSubtopic(){
    this.dialogRef.close(true)
  }

}

// selectboxdan subtopic secildikden sonra bura request at ve bu subtopice assign olunmus quizleri cek

// if (this.subTopicId) {
//   this.adminService.getAssignQuizForSubtopic(this.subTopicId).subscribe({
//     next: res => {
//       this.quizzIds = {
//         quizIds: res.result.map(item => item.quizId)
//       };

//     }
//   })
// }

// sonra yaradilmis quizin idsin gelen quiz idlere push et sonda ise save et

// this.quizzIds.quizIds.push(res.result)
// this.adminService.assignQuizForSubtopic(this.subTopicId, this.quizzIds).subscribe({
//   next: resSubTOpic => {
//     showInfoAlert('Added to selected subtopic', resSubTOpic.messages, false, true, 'Close')
//     this.router.navigate([`/main-teacher-management/teacher-module/videos/video-form/${this.subTopicId}`])

//   },
//   error: err => {
//     showErrorAlert('Error', err.message, 'Close')
//   }
// })