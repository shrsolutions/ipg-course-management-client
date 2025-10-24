import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { TeachersComponent } from '../teachers.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { showErrorAlert, showSuccessAlert } from 'src/app/shared/helper/alert';

@Component({
  selector: 'app-new-teacher',
  templateUrl: './new-teacher.component.html',
  styleUrls: ['./new-teacher.component.scss']
})
export class NewTeacherComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TeachersComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { tutorId: string },
    private adminService: AdminService,
    private fb: FormBuilder
  ) { }

  @ViewChild('fileInput') fileInput!: ElementRef;

  tutorForm: FormGroup = this.fb.group({
    imageFileId: [''],
    surname: ['', Validators.required],
    name: ['', Validators.required],
    about: ['', Validators.required]
  });

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  existingIconUrl: string | null = null;
  isLoading = false;
  showFileError = false;
  modalTitle = 'Add New Tutor'
  apiPreviewUrl: string | null = null;
  hasExistingIcon: boolean = false;


  ngOnInit() {
    if (this.data.tutorId !== '') {
      this.getTutorById()
      this.modalTitle = 'Update Tutor'
    }
  }

  getTutorById() {
    this.adminService.getTutorById(this.data.tutorId).subscribe({
      next: (response) => {
        this.tutorForm.patchValue(response.result);
        // API-dən gələn icon varsa
        if (response.result.imageFileId) {
          this.existingIconUrl = this.adminService.getTutorImagebyTutorID(this.data.tutorId, response.result.imageFileId);
          this.hasExistingIcon = true;
        }
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.showFileError = false;
      this.hasExistingIcon = true
      // Önizleme oluştur
      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.fileInput.nativeElement.value = '';

    // Əgər API-dən gələn icon varsa, onu da silmək istəyiriksə
    if (this.hasExistingIcon) {
      this.tutorForm.controls['imageFileId'].patchValue("");
      this.hasExistingIcon = false;
    }
  }

  isImage(file: File): boolean {
    return file.type.match('image.*') !== null;
  }

  saveCategory(): void {
    if (!this.selectedFile && !this.hasExistingIcon) {
      this.showFileError = true;
      return;
    }

    if (this.tutorForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('imageFile', this.selectedFile);
      Object.keys(this.tutorForm.controls).forEach((key: string) => {
        formData.append(key, this.tutorForm.get(key)?.value)
      });

      if (this.data.tutorId !== '') {
              this.adminService.updateTutor(formData, this.data.tutorId).subscribe({
        next: (response) => {
          if (response.statusCode == 200) {
            showSuccessAlert(response.messages)
            this.dialogRef.close()
          } else {
            showErrorAlert(response.messages);
            this.isLoading = false;

          }
        },
        error: err => {
          showErrorAlert(err.error.title, '', 'Close')
          this.isLoading = false;

        }
      });
      }else{
      this.adminService.addTutor(formData).subscribe({
        next: (response) => {
          if (response.statusCode == 200) {
            showSuccessAlert(response.messages)
            this.dialogRef.close()
          } else {
            showErrorAlert(response.messages);
            this.isLoading = false;

          }
        },
        error: err => {
          showErrorAlert(err.error.title, '', 'Close')
          this.isLoading = false;

        }
      });
      }


    }
  }

}
