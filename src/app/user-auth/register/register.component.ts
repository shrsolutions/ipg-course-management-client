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
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        patronymic: ["", Validators.required],
        dateOfBirth: ["2000-01-01", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        gender: ["", Validators.required],
        password: [
          "",
          (Validators.required),
        ],
        confirmPassword: [null, Validators.required],
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
    const authModel = {
      Email: this.registrationForm.get("email").value,
      Password: this.registrationForm.get("password").value,
      Name: this.registrationForm.get("firstName").value,
      Surname: this.registrationForm.get("lastName").value,
      Patronymic: this.registrationForm.get("patronymic").value,
      DateOfBirth: this.registrationForm.get("dateOfBirth").value.toISOString(),
      Gender: this.registrationForm.get("gender").value,
    };

    if (this.registrationForm.invalid) {
      this.invalid = true;
      return;
    }

    this.authService.signup(authModel).subscribe(
      (resData) => {
        this.router.navigate(["/auth/confirm-account"]);
      },
      (errorData) => {
        console.log(errorData);
      }
    );
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
