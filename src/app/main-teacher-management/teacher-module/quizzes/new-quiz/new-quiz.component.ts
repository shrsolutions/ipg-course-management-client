import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModel } from 'src/app/main-teacher-management/models/Base/FetchBaseModel';
import { QuizzesService } from 'src/app/services/quizzes.service';
import { showConfirmAlert, showErrorAlert, showInfoAlert } from 'src/app/shared/helper/alert';
import { ReadQuestionsComponent } from '../read-questions/read-questions.component';
import { MatDialog } from '@angular/material/dialog';
import Quill from "quill";
import ResizeModule from "@botom/quill-resize-module";
import { CanComponentDeactivate } from 'src/app/shared/utility/unsaved-changes.guard';
import imageCompression from 'browser-image-compression';
import { AdminService } from 'src/app/services/admin.service';
import { AssignQuizzToSubtopicComponent } from '../assign-quizz-to-subtopic/assign-quizz-to-subtopic.component';

const Font = Quill.import('attributors/class/font') as any; // TypeScript-ə uyğunlaşdırma
Font.whitelist = ['Calibri', 'TimesNewRoman', 'Arial', 'Monospace'];
Quill.register(Font, true);

Quill.register("modules/resize", ResizeModule);
@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.scss']
})
export class NewQuizComponent implements OnInit, CanComponentDeactivate {
  quizzId: string = undefined
  rateId: number = null
  constructor(
    private fb: FormBuilder,
    private quizzService: QuizzesService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private adminService: AdminService,
    public assignQuizzDialog: MatDialog,
  ) {
    this.route.params.subscribe((params) => {
      this.quizzId = params["id"];
    });
  }

  saved: boolean = true;
  quillConfig = {

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

      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
      ['formula'],

      ['image'],                      // link and image, video
      [{ 'font': ['Calibri', 'TimesNewRoman', 'Arial', 'Monospace'] }]
    ]
  }
  quillEditors: any[] = [];
  toolbarTimeouts: any[] = []; // Timeout-ları saxlamaq üçün array

  onEditorCreated(quill, index?: number) {
    quill.getModule('toolbar').addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.addEventListener('change', async () => {
        const file = input.files ? input.files[0] : null;
        if (file) {
          const maxSize = 2 * 1024 * 1024; // 2MB
          if (file.size > maxSize) {
            showErrorAlert('Şəkil ölçüsü maksimum 2MB ola bilər!', undefined, 'Bağla');
            return;
          }

          const options = {
            maxSizeMB: 0.5, // Maksimum ölçü 0.5MB olsun
            maxWidthOrHeight: 1024, // Maksimum en/yüksəklik 1024px olsun
            useWebWorker: true, // Performansı artırır
            initialQuality: 0.8 // İlk keyfiyyət dəyəri (0 - 1 arasında)
          };

          const compressedBlob = await imageCompression(file, options);

          const compressedFile = new File([compressedBlob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });


          const formData = new FormData();
          formData.append('ImageFile', compressedFile);

          this.quizzService.uploadImage(formData).subscribe({
            next: response => {
              if (response?.result?.downloadLink) {
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', response.result.downloadLink);
                if (index !== -1) {
                  const answersControl = this.questionsForm.get('answers') as FormArray;
                  const answerFormGroup = answersControl.at(index) as FormGroup;
                  answerFormGroup.get('text')?.setValue(quill.root.innerHTML);
                } else {
                  this.questionsForm.controls['text'].setValue(quill.root.innerHTML);
                }
              } else {
                showErrorAlert('Şəkil yükləmə uğursuz oldu', undefined, 'Bağla')
              }
            },
            error: err => {
              showErrorAlert(err, undefined, 'Bağla')
            }
          });
        }
      });

      input.click();
    });

    this.quillEditors[index] = quill;

    this.quillEditors[index].getModule('toolbar').container.style.display = 'none';
    const toolbar = this.quillEditors[index].getModule('toolbar').container;

    this.quillEditors[index].root.addEventListener('focus', () => {
      this.showToolbar(index);
    });

    this.quillEditors[index].root.addEventListener('blur', (event) => {
      if (!toolbar.contains(event.relatedTarget)) {
        this.hideToolbar(index);
      }
    });

  }
  showToolbar(index: number) {
    if (this.quillEditors[index]) {
      this.quillEditors[index].getModule('toolbar').container.style.display = 'block';
    }
  }

  hideToolbar(index: number) {
    if (this.quillEditors[index]) {
      setTimeout(() => {
        this.quillEditors[index].getModule('toolbar').container.style.display = 'none';
      }, 0);
    }
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
    stateId: [2, Validators.required],
    quizQuestionIds: []
  });

  questionsForm = this.fb.group({
    id: [null],
    text: ['', Validators.required], // Question text
    rateId: [this.rateId, [Validators.required]], // Rate ID
    typeId: [1, [Validators.required, Validators.min(1)]], // Type ID
    languageId: [1, [Validators.required, Validators.min(1)]], // Language ID
    answers: this.fb.array([]), // Dynamic answers
  });

  selectedIsCorrect: boolean = false
  subTopicId: string
  quizzIds: any
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.subTopicId = params['subtopic'];
      console.log('Gelen subtopicId:', this.subTopicId);
    });
    for (let i = 0; i < 3; i++) {
      this.addAnswer();
    }
    if (this.quizzId !== undefined) {
      this.getQuizzById()
    }
    if (this.subTopicId) {
      this.adminService.getAssignQuizForSubtopic(this.subTopicId).subscribe({
        next: res => {
          this.quizzIds = {
            quizIds: res.result.map(item => item.quizId)
          };

        }
      })
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
        this.rateId = this.savedQuestions[0].rateId
        this.questionsForm.patchValue({ rateId: this.rateId });
      }
    })
  }


  // QUESTIONS

  addNewQuestion(): void {
    this.questionsForm.reset();
    this.questionsForm.get('languageId').patchValue(1)
    this.questionsForm.get('typeId').patchValue(1)
    this.questionsForm.get('rateId').patchValue(this.rateId)
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
    if (this.questionsForm.dirty) {
      const userConfirmed = confirm("Dəyişikliklər yadda saxlanılmayıb! Sualı dəyişmək istədiyinizə əminsiniz?");
      if (!userConfirmed) {
        return;
      }
    }

    this.saved = false
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
    this.saved = false
    if (this.selectedQuestionIndex == -1) {
      this.quizzService.addQuestion(questionData).subscribe({
        next: response => {
          showInfoAlert('', response.messages, false, true, 'Close')
          const newQuestionId = response.result; // Geri qayıdan id

          this.savedQuestions.push({ ...questionData, id: newQuestionId });

          this.questionsForm.reset();
          this.questionsForm.get('languageId').patchValue(1)
          this.questionsForm.get('typeId').patchValue(1)
          this.questionsForm.get('rateId').patchValue(this.rateId)
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
    this.saved = true

    if (this.quizzId == null) {
      this.quizzService.addQuizz(this.quizForm.value).subscribe({
        next: (res: any) => {
          if (this.subTopicId) {
            this.quizzIds.quizIds.push(res.result)
            this.adminService.assignQuizForSubtopic(this.subTopicId, this.quizzIds).subscribe({
              next: resSubTOpic => {
                showInfoAlert('Added to selected subtopic', resSubTOpic.messages, false, true, 'Close')
                this.router.navigate([`/main-teacher-management/teacher-module/videos/video-form/${this.subTopicId}`])

              },
              error: err => {
                showErrorAlert('Error', err.message, 'Close')
              }
            })
          } else {
            showConfirmAlert('Do you want to assign the created quiz to a subtopic?', '', 'Assign subtopic', `Close`).then((result) => {
              if (result.isConfirmed) {
                let dialogRef = this.assignQuizzDialog.open(AssignQuizzToSubtopicComponent, {
                  maxHeight: "95vh",
                  width: "60%",
                  data: { quizId: res.result },
                });

                dialogRef.afterClosed().subscribe((result) => {
                  console.log(result)
                  if (!result) {
                    showInfoAlert('', "Quiz was not assigned to any subtopic.", false, true, 'Close')
                    this.router.navigate(['/main-teacher-management/teacher-module/quizzes'])
                  } else {
                    this.router.navigate(['/main-teacher-management/teacher-module/quizzes'])
                    showInfoAlert('',"Added to selected subtopic", false, true, 'Close')

                  }

                });

              } else {
                this.router.navigate(['/main-teacher-management/teacher-module/quizzes'])
                showInfoAlert('', res.messages, false, true, 'Close')
              }
            })


          }
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

  changeRateId() {
    this.questionsForm.patchValue({ rateId: this.rateId });
  }

  readMore(id: string) {
    this.dialog.open(ReadQuestionsComponent, {
      data: id,
      width: '80%',
      maxHeight: '95vh'
    })
  }

  canDeactivate(): boolean {
    if (!this.saved) {
      return confirm("Dəyişikliklər yadda saxlanılmayıb! Çıxmaq istədiyinizə əminsiniz?");
    }
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.saved) {
      event.preventDefault();
    }
  }



}
