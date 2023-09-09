import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})
export class ConfirmAccountComponent implements OnInit {
  confirmCodeForm: FormGroup;
  confirmationError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.authService.user.subscribe(user=>{
      console.log(user)
    })
  }

  initializeForm() {
    this.confirmCodeForm = this.fb.group({
      confirmCode: ['', [Validators.required, Validators.minLength(6)]], // Add validation rules here
    });
  }

  onConfirmCode() {
    if (this.confirmCodeForm.valid) {
      const confirmCode = this.confirmCodeForm.get('confirmCode').value;

      // Call your AuthService method to confirm the code
      this.authService.confirmCode(confirmCode).subscribe(
        (response) => {
          // Handle successful confirmation, e.g., redirect to another page
          // Reset the form
          console.log(response)
          this.confirmCodeForm.reset();
        },
        (error) => {
          console.log(error)
          // Handle the error if the code is invalid
          this.confirmationError = 'Invalid confirmation code. Please try again.';
        }
      );
    } else {
      // Form is invalid, display validation error messages
      this.confirmationError = 'Please enter a valid confirmation code.';
    }
  }
}

