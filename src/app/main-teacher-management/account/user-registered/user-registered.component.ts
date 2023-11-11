import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-registered",
  templateUrl: "./user-registered.component.html",
  styleUrls: ["./user-registered.component.scss"],
})
export class UserRegisteredComponent {
  registrationForm: FormGroup;
  hidePassword = true;
  invalid: boolean = false;
  constructor(private fb: FormBuilder, private router: Router) {
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
