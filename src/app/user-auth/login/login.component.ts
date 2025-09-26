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
import { showInfoAlert } from "src/app/shared/helper/alert";
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
    if (localStorage.getItem("user") !== null) {
       this.router.navigate(["/main-teacher-management/main-home"])
    }
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


      },
      error: err => {
        showInfoAlert("Info", err.error.messages[0],true, false, '', 'Close')
      }
    });
  }
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
