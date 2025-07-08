import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CategoryComponent } from '../category.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { showErrorAlert, showSuccessAlert } from 'src/app/shared/helper/alert';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CategoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { categoryID: string },
    private adminService: AdminService,
    private fb: FormBuilder,

  ) { }
  paginatorModel = {
    count: 50,
    page: 1,
  };

  @ViewChild('fileInput') fileInput!: ElementRef;

  categoryForm: FormGroup = this.fb.group({
    id: [this.data.categoryID],
    iconFileId: [''],
    languageId: [1, Validators.required],
    translation: ['', Validators.required],
  });
  languages: any[] = []; 
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  existingIconUrl: string | null = null;
  isLoading = false;
  showFileError = false;
  modalTitle = 'Add New Category'
 apiPreviewUrl: string | null = null;
  hasExistingIcon: boolean = false;
  ngOnInit() {
    if (this.data.categoryID !== '') {
      this.getCategoryById()
      this.modalTitle = 'Update Category'
    }
  }

getCategoryById() {
    this.adminService.getByIdCategory(this.data.categoryID).subscribe({
      next: (response) => {
        this.categoryForm.controls['iconFileId'].patchValue(response.result.iconFileId);
        this.categoryForm.controls['translation'].patchValue(response.result.translations[0].translation);
        
        // API-dən gələn icon varsa
        if (response.result.iconFileId) {
          this.existingIconUrl = `http://api.codera.az/api/categories/${this.data.categoryID}/icon-${response.result.iconFileId}`;
          this.hasExistingIcon = true;
        }
        console.log(this.categoryForm.value)
      }
    });
  }


  loadLanguage() {
    this.adminService.fetchAllLanguage(this.paginatorModel).subscribe({
      next: (responseData) => {

        const data = responseData.result.data;
        this.languages = data;
      },
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
      this.apiPreviewUrl = null;
      this.categoryForm.controls['iconFileId'].patchValue("");
      this.hasExistingIcon = false;
    }
  }

  isImage(file: File): boolean {
    return file.type.match('image.*') !== null;
  }

  saveCategory(): void {
    if (!this.selectedFile) {
      this.showFileError = true;
      return;
    }

    if (this.categoryForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      console.log(this.categoryForm.value.id)
      formData.append('Id', this.categoryForm.value.id);
      formData.append('IconFileId', this.categoryForm.value.iconFileId);
      formData.append('IconFile', this.selectedFile);
      formData.append('Translation.LanguageId', this.categoryForm.value.languageId);
      formData.append('Translation.Translation', this.categoryForm.value.translation);
      this.adminService.onAddCategory(formData).subscribe({
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
          showErrorAlert(err.error.title,'','Close')
          this.isLoading = false;

        }
      });
    }
  }

}
