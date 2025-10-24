import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as CryptoJS from 'crypto-js';
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
  ) { }
  secretKey = 'IPGCOURSERAMZEYRASHAD';
  otpConfig = {
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
    allowNumbersOnly: true,
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };

  ngOnInit() {
    this.initializeForm();
  }

  getDecryptedKey(): string | null {
    const encryptedKey = localStorage.getItem('twoStepAuthKey');
    if (!encryptedKey) return null;

    const bytes = CryptoJS.AES.decrypt(encryptedKey, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  initializeForm() {
    this.confirmCodeForm = this.fb.group({
      key: [this.getDecryptedKey(), Validators.required],
      confirmCode: ["", [Validators.required, Validators.minLength(6)]], // Add validation rules here
    });
  }

  onConfirmCode() {
    if (this.confirmCodeForm.valid) {
      this.authService.twoStepVerify(this.confirmCodeForm.value).subscribe({

        next: (response) => {

        },
        error: (error) => {
          if (error.error.statusCode == 429 || error.error.messages[0] == "InvalidRequestValues") {
            this.router.navigate(["/auth/login"])
          }
          this.confirmationError =
            "Invalid confirmation code. Please try again.";
          this.confirmCodeForm.get('confirmCode').patchValue('')
        }
      });
    } else {
      this.confirmationError = "Please enter a valid confirmation code.";
    }
  }
  countdown: number = 0; // Geri sayım
  isResendDisabled: boolean = false; // Düymənin aktivlik vəziyyəti
  
  resendCode() {
    if (this.isResendDisabled) {
      return; // Əgər geri sayım gedirsə, heç nə etmə
    }
  
    this.authService.resendConfirmCode(this.getDecryptedKey()).subscribe({
      next: res => {
        this.confirmationError = res.messages;
        this.startCountdown(); // Geri sayımı başlat
      },
      error: err => {
        this.confirmationError = err.error.messages[0];
        if (err.error.messages[0] == "InvalidRequestValues") {
          this.router.navigate(["/auth/login"])
        }
      }
    });
  }
  
  // Geri sayımı başlat
  startCountdown() {
    this.isResendDisabled = true;
    this.countdown = 30; // 30 saniyə geri sayım
  
    const interval = setInterval(() => {
      this.countdown--;
  
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.isResendDisabled = false; // Düyməni yenidən aktiv et
      }
    }, 1000); // Hər saniyə geri sayımı azalt
  }
}
