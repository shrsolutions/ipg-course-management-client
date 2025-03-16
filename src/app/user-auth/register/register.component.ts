// register.component.ts
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import ValidatorUtility from "src/app/shared/utility/validator-utility";
import { LoadingService } from "src/app/shared/services/loading.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  hidePassword = true;
  invalid: boolean = false;
  formData = new FormData();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.registrationForm = this.fb.group(
      {
        name: ["", Validators.required],
        surname: ["", Validators.required],
        patronymic: ["", Validators.required],
        dateOfBirth: ["2000-01-01", Validators.required],
        email: [""],
        gender: ["", Validators.required],
        phoneNumber: ["", Validators.required],
        password: ["",Validators.required],
        confirmPassword: [null, Validators.required],
        identifierType: [2]
      },
      {
        validators: [
          ValidatorUtility.matchingPasswords,
          ValidatorUtility.dateOfBirthValidator(18, 100),
        ],
      }
    );
  }

  onSubmit() {
    this.formData = new FormData()
    if (this.registrationForm.invalid) {
      this.invalid = true;
      return;
    }

    Object.keys(this.registrationForm.controls).forEach((key) => {
      const value = this.registrationForm.get(key)?.value;
      this.formData.append(key, value);
    });


    this.authService.signup(this.formData).subscribe({
      next: resData => {
        this.router.navigate(["/auth/confirm-account"]);
      },
      error: errorData => {
        console.log(errorData);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
