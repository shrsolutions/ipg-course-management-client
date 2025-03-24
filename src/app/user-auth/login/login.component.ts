import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import * as CryptoJS from 'crypto-js';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  hidePassword = true;

  signupForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.signupForm = this.fb.group({
      identifier: ["", Validators.required],
      password: ["", Validators.required],
      identifierType: [2],
    });
  }

  secretKey = 'IPGCOURSERAMZEYRASHAD'; 

  encryptAndStore(key: string) {
    const encryptedKey = CryptoJS.AES.encrypt(key, this.secretKey).toString();
    localStorage.setItem('twoStepAuthKey', encryptedKey);
  }

  onSubmit() {
    this.authService.signIn(this.signupForm.value).subscribe({
      next: res => {
        if (res.result.twoStepAuthRequired) {
          this.encryptAndStore(res.result.twoStepAuthKey)
          this.router.navigate(["/auth/confirm-account"]);
        } else {
          this.router.navigate(["/main-teacher-management/main-home"])
        }
      },
      error: err => {

      }
    });
  }
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
