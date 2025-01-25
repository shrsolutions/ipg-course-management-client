import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-confirm-account",
  templateUrl: "./confirm-account.component.html",
  styleUrls: ["./confirm-account.component.scss"],
})
export class ConfirmAccountComponent implements OnInit {
  confirmCodeForm: FormGroup;
  confirmationError: string = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.authService.user.subscribe((user) => {
    });
  }

  initializeForm() {
    this.confirmCodeForm = this.fb.group({
      confirmCode: ["", [Validators.required, Validators.minLength(6)]], // Add validation rules here
    });
  }

  onConfirmCode() {
    if (this.confirmCodeForm.valid) {
      const confirmCode = this.confirmCodeForm.get("confirmCode").value;

      this.authService.confirmCode(confirmCode).subscribe(
        (response) => {
          this.router.navigate(["/"]);
          this.confirmCodeForm.reset();
        },
        (error) => {
          console.log(error);
          // Handle the error if the code is invalid
          this.confirmationError =
            "Invalid confirmation code. Please try again.";
        }
      );
    } else {
      // Form is invalid, display validation error messages
      this.confirmationError = "Please enter a valid confirmation code.";
    }
  }
}
