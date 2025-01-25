import { AfterContentChecked, AfterContentInit, AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewQuizComponent } from '../new-quiz/new-quiz.component';
import { QuizzesService } from 'src/app/services/quizzes.service';

@Component({
  selector: 'app-read-questions',
  templateUrl: './read-questions.component.html',
  styleUrls: ['./read-questions.component.scss']
})
export class ReadQuestionsComponent implements OnInit, AfterContentInit {

  constructor(
    public dialogRef: MatDialogRef<NewQuizComponent>,
    @Inject(MAT_DIALOG_DATA) public questionId: string,
    private quizzService: QuizzesService,
    private cdr: ChangeDetectorRef
  ) { }

  question: any = {}

  ngOnInit() {
    this.quizzService.getQuestionById(this.questionId).subscribe({
      next: res => {
        this.question = res.result
      }
    })
  }

  ngAfterContentInit(): void {
    this.cdr.detectChanges()
  }

}
