import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LibraryService } from "src/app/services/library.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import ValidatorUtility from "src/app/shared/utility/validator-utility";
import { AuthService } from "src/app/user-auth/auth.service";

@Component({
  selector: "app-user-registered",
  templateUrl: "./user-registered.component.html",
  styleUrls: ["./user-registered.component.scss"],
})
export class UserRegisteredComponent {
  registrationForm: FormGroup;
  hidePassword = true;
  invalid: boolean = false;
  type:number;
  constructor(
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute,
    private libraryService: LibraryService,
    private notificationService: NotificationService,
    private authService: AuthService

  ) {
    this.registrationForm = this.fb.group({
      name: ["", Validators.required],
      surname: ["", Validators.required],
      patronymic: [""],
      password: [
        "",
        [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)],
      ],
      confirmPassword: [""],
      dateOfBirth: ["", Validators.required],
      gender: ["", Validators.required],
    });

    // Custom validator to check if password and confirmPassword match
    this.registrationForm.get("confirmPassword").setValidators((control) => {
      if (
        control.value !== this.registrationForm.get("password").value &&
        this.registrationForm.get("password").touched
      ) {
        return { not_matching: true };
      }
      return null;
    });

    // Custom validator to check if age is between 18 and 100
    this.registrationForm.get("dateOfBirth").setValidators((control) => {
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 18 || age > 100) {
        return { ageOutOfRange: true };
      }
      return null;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.type=params['type']

    });
    this.initialForm();

    this.onGetAllCategories()

  }
  initialForm() {
    debugger
    this.registrationForm = this.fb.group(
      {
        name: [ this.editData?.name ||"", Validators.required],
        surname: [ this.editData?.surname ||"", Validators.required],
        patronymic: [ this.editData?.patronymic||"", Validators.required],
        dateOfBirth: [ this.editData?.dateOfBirth ||"2000-01-01", [Validators.required]],
        gender: [this.editData?.gender ||"", Validators.required],

      }
    );
  }
  editData:any
  onGetAllCategories(): void {
    this.libraryService.fetchUserData().subscribe({
      next: (response) => {
        debugger
        this.editData=response.result
        this.initialForm()
      },
    });
  }
  file: any = 0
type1: boolean = false
choosenFile: any
EditType: boolean = false
  onUpload(event: any): void {
    debugger
    this.file = event.target.files[0];
    this.EditType = false
    if (event.target.files[0].name != " ") {
      this.type1 = true
      this.choosenFile = event.target.files[0].name
    }
    this.saveFile()
  }
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  EditFile: any = []

saveFile(){
  const formData = new FormData();

  formData.append('image', this.file ? this.file : this.EditFile[0]?.downloadKey);
  this.authService.postProfileImage(formData).subscribe({
    next: (response) => {
      if (response.statusCode==200) {
        this.notificationService.showSuccess(
          response.messages
        );
        window.location.reload();

      } else {
        this.notificationService.showError("Any Error happened");
      }
    },
  });

}
  onSubmit(): void {
    if (this.registrationForm.valid) {
      // Perform registration logic here
      this.registrationForm.value.file=null

debugger
      this.authService.editProfile(this.registrationForm.value).subscribe({
        next: (response) => {
          if (response.statusCode==200) {
            this.notificationService.showSuccess(
              response.messages
            );

          } else {
            this.notificationService.showError("Any Error happened");
          }
        },
      });

      // For example, you might want to navigate to a different page after successful registration
      this.router.navigate(["/dashboard"]);
    } else {
      // Mark all form controls as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach((key) => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }
}
