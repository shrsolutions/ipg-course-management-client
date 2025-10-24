import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AdsComponent } from '../ads.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { showErrorAlert, showSuccessAlert } from 'src/app/shared/helper/alert';

@Component({
  selector: 'app-new-ad',
  templateUrl: './new-ad.component.html',
  styleUrls: ['./new-ad.component.scss']
})
export class NewAdComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AdsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private adminService: AdminService,
    private fb: FormBuilder
  ) { }

  @ViewChild('fileInput') fileInput!: ElementRef;

  adForm: FormGroup = this.fb.group({
    imageFileId: [''],
    url: ['', Validators.required],
  });

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  existingIconUrl: string | null = null;
  isLoading = false;
  showFileError = false;
  modalTitle = 'Add New Ad'
  apiPreviewUrl: string | null = null;
  hasExistingIcon: boolean = false;


  ngOnInit() {
    if (this.data !== null) {
      this.getAdById()
      this.modalTitle = 'Update Ad'
    }
  }

  getAdById() {
    this.adForm.patchValue(this.data);
    // API-dən gələn icon varsa
    if (this.data.imageFileId) {
      this.existingIconUrl = this.adminService.getAdImagebyAdID(this.data.id, this.data.imageFileId);
      this.hasExistingIcon = true;
    }
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
      this.adForm.controls['imageFileId'].patchValue("");
      this.hasExistingIcon = false;
    }
  }

  isImage(file: File): boolean {
    return file.type.match('image.*') !== null;
  }

  saveAdd(): void {
    if (!this.selectedFile && !this.hasExistingIcon) {
      this.showFileError = true;
      return;
    }

    if (this.adForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('imageFile', this.selectedFile);
      Object.keys(this.adForm.controls).forEach((key: string) => {
        formData.append(key, this.adForm.get(key)?.value)
      });

      if (this.data !== null) {
        this.adminService.updateAd(formData, this.data.id).subscribe({
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
      } else {
        this.adminService.addAd(formData).subscribe({
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
