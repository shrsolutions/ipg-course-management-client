import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
    @Inject(MAT_DIALOG_DATA) public questionData: any,
    private quizzService: QuizzesService,
    private cdr: ChangeDetectorRef
  ) { }

  question: any = {}

  @ViewChildren('answerContent') answerContents!: QueryList<ElementRef>;
  quillConfig={
    //toolbar: '.toolbar',
    toolbar: false
  }
  ngOnInit() {
    this.quizzService.getQuestionById(this.questionData.id).subscribe({
      next: res => {
        this.question = res.result
        
        setTimeout(() => {
          this.fillAnswerContents();
        });
      }
    })
  }

  ngAfterContentInit(): void {
    this.cdr.detectChanges()
  }

  fillAnswerContents() {
    this.answerContents.forEach((elementRef, index) => {
      if (this.question.answers[index]) {
        elementRef.nativeElement.innerHTML = this.question.answers[index].text;
      }
    });
  }



}
