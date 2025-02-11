import {  Component,  OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModel } from 'src/app/main-teacher-management/models/Base/FetchBaseModel';
import { QuizzesService } from 'src/app/services/quizzes.service';
import { showConfirmAlert, showErrorAlert, showInfoAlert } from 'src/app/shared/helper/alert';
import { ReadQuestionsComponent } from '../read-questions/read-questions.component';
import { MatDialog } from '@angular/material/dialog';
import Quill from "quill";
import ResizeModule from "@botom/quill-resize-module";

const Font = Quill.import('attributors/class/font') as any; // TypeScript-ə uyğunlaşdırma
Font.whitelist = ['Calibri','TimesNewRoman',  'Arial', 'Monospace'];
Quill.register(Font, true);

Quill.register("modules/resize", ResizeModule);
@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.scss']
})
export class NewQuizComponent implements OnInit {
  quizzId: string = undefined
  constructor(
    private fb: FormBuilder,
    private quizzService: QuizzesService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.params.subscribe((params) => {
      this.quizzId = params["id"];
    });
  }


  quillConfig = {
    //toolbar: '.toolbar',
    formula: true,
    resize: {
      locale: {
        // change them depending on your language
        altTip: "Hold down the alt key to zoom",
        floatLeft: "Left",
        floatRight: "Right",
        center: "Center",
        restore: "Restore",
      },
    },
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
      ['formula'],

      ['image']  ,                      // link and image, video
      [{ 'font': [ 'Calibri','TimesNewRoman', 'Arial', 'Monospace'] }]
    ]
  }

  onEditorCreated(quill, index?: number) {
    quill.getModule('toolbar').addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.addEventListener('change', () => {
        const file = input.files ? input.files[0] : null;
        if (file) {
          const formData = new FormData();
          formData.append('ImageFile', file);


          // `subscribe` ilə servisi çağırırıq
          this.quizzService.uploadImage(formData).subscribe({
            next: response => {
              if (response?.result?.downloadLink) {
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', response.result.downloadLink);
                if (index !== -1) {
                  const answersControl = this.questionsForm.get('answers') as FormArray;
                  const answerFormGroup = answersControl.at(index) as FormGroup;
                  answerFormGroup.get('text')?.setValue(quill.root.innerHTML);
                  console.log('cavab')
                } else {
                  console.log('sual')
                  this.questionsForm.controls['text'].setValue(quill.root.innerHTML);
                }
              } else {
                showErrorAlert('Şəkil yükləmə uğursuz oldu', undefined, 'Bağla')
              }
            },
            error: err => {
              console.log(err)
              showErrorAlert(err, undefined, 'Bağla')
            }
          });
        }
      });

      input.click();
    });
  }

  paginatorModel: PaginatorModel = {
    count: 100,
    page: 1,
  };

  subjects: any[]
  topics: any[]
  subTopics: any[]

  btnNextPrev = {
    prev: true,
    next: false,
    index: 0
  }

  savedQuestions: any[] = [];

  quizForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    stateId: [1, Validators.required],
    quizQuestionIds: []
  });

  questionsForm = this.fb.group({
    id: [null],
    text: ['', Validators.required], // Question text
    rateId: [null, [Validators.required, Validators.min(1)]], // Rate ID
    typeId: [1, [Validators.required, Validators.min(1)]], // Type ID
    languageId: [1, [Validators.required, Validators.min(1)]], // Language ID
    answers: this.fb.array([]), // Dynamic answers
  });

  selectedIsCorrect: boolean = false

  ngOnInit(): void {
    // this.onLoadSubject();
    for (let i = 0; i < 3; i++) {
      this.addAnswer();
    }
    console.log(this.quizzId)
    if (this.quizzId !== undefined) {
      this.getQuizzById()
    }
  }


  navig(n: any) {
    switch (n) {
      case 'next': {
        this.btnNextPrev.index++
      }; break;
      case 'prev': {
        this.btnNextPrev.index--
      }; break;
    }
  }

  // QUIZ
  getQuizzById() {
    this.quizzService.getQuizzById(this.quizzId).subscribe({
      next: res => {
        this.quizForm.patchValue(res.result)
        this.savedQuestions = res.result.questions
      }
    })
  }


  // QUESTIONS

  addNewQuestion(): void {
    this.questionsForm.reset();
    this.questionsForm.get('languageId').patchValue(1)
    this.questionsForm.get('typeId').patchValue(1)
    this.selectedIsCorrect = false
    this.answers.clear();
    for (let i = 0; i < 3; i++) {
      this.addAnswer();
    }
  }

  get answers(): FormArray {
    return this.questionsForm.get('answers') as FormArray;
  }

  addAnswer(): void {
    if (this.answers.length < 5) {
      this.answers.push(
        this.fb.group({
          id: [null],
          text: ['', Validators.required],
          isCorrect: [false],
        })
      );
    } else {
      alert('Maximum 5 answers allowed.');
    }
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 3) {
      this.answers.removeAt(index);
    } else {
      alert('Minimum 3 answers required.');
    }
  }

  selectedQuestionIndex: number = -1
  editQuestion(questionId: string, index: number): void {
    this.selectedQuestionIndex = index
    this.quizzService.getQuestionById(questionId).subscribe({
      next: res => {
        this.questionsForm.patchValue(res.result);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.selectedIsCorrect = true
        this.answers.clear();
        res.result.answers.forEach((answer: any) => {
          this.answers.push(this.fb.group({
            id: [answer.id],
            text: [answer.text, Validators.required],
            isCorrect: [answer.isCorrect],
          }));
        });
      }
    })
  }

  saveQuestions(): void {
    if (this.questionsForm.invalid) return;
    const questionData = this.questionsForm.value;
    // Sualı saxlamaq üçün API çağırışı
    console.log(questionData)
    if (this.selectedQuestionIndex == -1) {
      this.quizzService.addQuestion(questionData).subscribe({
        next: response => {
          showInfoAlert('', response.messages, false, true, 'Close')
          const newQuestionId = response.result; // Geri qayıdan id

          this.savedQuestions.push({ ...questionData, id: newQuestionId });

          this.questionsForm.reset();
          this.questionsForm.get('languageId').patchValue(1)
          this.questionsForm.get('typeId').patchValue(1)
          this.selectedIsCorrect = false
          this.answers.clear();
          for (let i = 0; i < 3; i++) {
            this.addAnswer();
          }
        }
      });
    } else {
      this.quizzService.editQuestion(questionData, this.questionsForm.get('id').value).subscribe({
        next: response => {
          showInfoAlert('', response.messages, false, true, 'Close')

          this.savedQuestions[this.selectedQuestionIndex] = questionData;

          this.selectedQuestionIndex = -1
          this.questionsForm.reset();
          this.questionsForm.get('languageId').patchValue(1)
          this.questionsForm.get('typeId').patchValue(1)
          this.selectedIsCorrect = false
          this.answers.clear();
          for (let i = 0; i < 3; i++) {
            this.addAnswer();
          }
        }
      });
    }

  }

  toggleCorrectAnswer(selectedIndex: number, event: any): void {
    if (!event.checked) {
      console.log(event.checked)
      this.selectedIsCorrect = false
    } else this.selectedIsCorrect = true
    this.answers.controls.forEach((control, index) => {
      if (index !== selectedIndex) {
        control.get('isCorrect')?.setValue(false);
      }
    });
  }

  removeQuestion(id: number, index: number) {
    showConfirmAlert('Delete selected row?', '', 'Delete', `Close`).then((result) => {
      if (result.isConfirmed) {
        showInfoAlert('', 'The operation was completed successfully!', false, true, 'Close')
        this.savedQuestions.splice(index, 1);
        this.savedQuestions = [...this.savedQuestions]
      }
    })
  }

  saveQuizz() {
    const quizQuestionIds = this.quizForm.get('quizQuestionIds')?.value || [];
    this.savedQuestions.forEach((question: any) => {
      quizQuestionIds.push(question.id);
    });
    this.quizForm.patchValue({ quizQuestionIds });

    if (this.quizzId == null) {
      this.quizzService.addQuizz(this.quizForm.value).subscribe({
        next: (res: any) => {
          showInfoAlert('', res.messages, false, true, 'Close')
          this.router.navigate(['/main-teacher-management/teacher-module/quizzes'])
        },
        error: err => {
          showErrorAlert('Error', err.message, 'Close')
        }
      })
    } else {
      this.quizzService.editQuizz(this.quizForm.value, this.quizzId).subscribe({
        next: (res: any) => {
          showInfoAlert('', res.messages, false, true, 'Close')
          this.router.navigate(['/main-teacher-management/teacher-module/quizzes'])
        },
        error: err => {
          showErrorAlert('Error', err.message, 'Close')
        }
      })
    }

  }

  readMore(id: string) {
    this.dialog.open(ReadQuestionsComponent, {
      data: id,
      width: '80%',
      maxHeight: '95vh'
    })
  }

}
