import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LibraryService } from "src/app/services/library.service";
import ValidatorUtility from "src/app/shared/utility/validator-utility";

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
    private libraryService: LibraryService

  ) {
    this.registrationForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      patronymic: [""],
      email: ["", [Validators.required, Validators.email]],
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
    this.onGetAllCategories()
    this.initialForm();

  }
  initialForm() {
    this.registrationForm = this.fb.group(
      {
        firstName: [ this.editData.name ||"", Validators.required],
        lastName: [ this.editData.surname ||"", Validators.required],
        patronymic: [ this.editData.patronymic||"", Validators.required],
        dateOfBirth: [ this.editData.dateOfBirth ||"2000-01-01", [Validators.required]],
        email: [ this.editData.email ||"", [Validators.required, Validators.email]],
        gender: [this.editData.gender ||"", Validators.required],
       
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
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      // Perform registration logic here
      console.log("Registration form submitted:", this.registrationForm.value);
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
