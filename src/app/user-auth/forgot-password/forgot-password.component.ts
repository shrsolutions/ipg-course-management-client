import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { showInfoAlert } from 'src/app/shared/helper/alert';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  constructor(
    private authService: AuthService,
    private router: Router) {

  }

  identifier: string
  secretKey = 'IPGCOURSERAMZEYRASHAD';


  sendCode() {
    let postData = {
      identifier: this.identifier,
      identifierType: 2
    }
    this.authService.sendForgotPasswordCode(postData).subscribe({
      next: res => {
        console.log(res)
        if (res.result) {
          this.encryptAndStore(res.result)
          this.router.navigate(["/auth/verify"]);
        } else {
          showInfoAlert("Info", "Try again", true, false, '', 'Close')

        }
        // if (res.result.twoStepAuthRequired) {
        //   this.encryptAndStore(res.result.twoStepAuthKey)
        //   this.router.navigate(["/auth/confirm-account"]);
        // } else {
        //   this.router.navigate(["/main-teacher-management/main-home"])
        //   setTimeout(() => {
        //     location.reload()
        //   }, 200);
        // }

      },
      error: err => {
        showInfoAlert("Info", err.error.messages[0], true, false, '', 'Close')
      }
    });
  }

  encryptAndStore(key: string) {
    const encryptedKey = CryptoJS.AES.encrypt(key, this.secretKey).toString();
    localStorage.setItem('verifyOtp', encryptedKey);
  }

}
