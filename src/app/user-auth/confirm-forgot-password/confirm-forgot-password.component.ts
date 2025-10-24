import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../auth.service';
import { showInfoAlert } from 'src/app/shared/helper/alert';

@Component({
  selector: 'app-confirm-forgot-password',
  templateUrl: './confirm-forgot-password.component.html',
  styleUrls: ['./confirm-forgot-password.component.scss']
})
export class ConfirmForgotPasswordComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  confirmCodeForm: FormGroup;
  confirmationError: string = "";
  hidePassword = true;

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
    this.initializeForm()
    this.startCountdown()
    if (!this.getDecryptedKey()) {
      // this.router.navigate(["/auth/login"])
    }
  }

  initializeForm() {
    this.confirmCodeForm = this.fb.group({
      key: [this.getDecryptedKey(), Validators.required],
      confirmCode: ["", [Validators.required, Validators.minLength(6)]],
      passwordGroup: this.fb.group(
        {
          password: ["", [Validators.required,  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)]],
          confirmPassword: ["", Validators.required]
        },
        { validators: this.passwordsMatchValidator } // custom validator
      )
    });
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }


  getDecryptedKey(): string | null {
    const encryptedKey = localStorage.getItem('verifyOtp');
    if (!encryptedKey) return null;

    const bytes = CryptoJS.AES.decrypt(encryptedKey, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  onConfirmCode() {
    if (this.confirmCodeForm.valid) {
      const formValue = this.confirmCodeForm.value;

      const payload = {
        key: formValue.key,
        confirmCode: formValue.confirmCode,
        data: {
          password: formValue.passwordGroup.password
        }
      };
      this.authService.verifyForgotPasswordOtp(payload).subscribe({

        next: (response) => {
          if (response) {
            this.router.navigate(["/auth/login"])

          }
        },
        error: (error) => {
          showInfoAlert("Info", error.error.messages[0], true, false, '', 'Close')
        }
      });
    } else {
      this.confirmationError = "Please enter a valid confirmation code.";
    }
  }

  resendCode() {
    if (this.isResendDisabled) {
      return; // Əgər geri sayım gedirsə, heç nə etmə
    }
    alert()

    this.authService.resendConfirmCodeForgotPassword(this.getDecryptedKey()).subscribe({
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
  countdown: number = 0; // Geri sayım
  isResendDisabled: boolean = false; // Düymənin aktivlik vəziyyəti
  // Geri sayımı başlat
  startCountdown() {
    this.isResendDisabled = true;
    this.countdown = 10; // 30 saniyə geri sayım

    const interval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(interval);
        this.isResendDisabled = false; // Düyməni yenidən aktiv et
      }
    }, 1000); // Hər saniyə geri sayımı azalt
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
