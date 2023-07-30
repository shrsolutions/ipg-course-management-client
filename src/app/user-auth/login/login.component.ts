import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hidePassword = true;
 
  signupForm:FormGroup;
  constructor(private fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.initialForm();
  }

  

initialForm() {
  this.signupForm = this.fb.group({
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&]{8,}$/)]]
  });
}

   get email() {
    return this.signupForm.get('email');
  } 

   get password() {
    return this.signupForm.get('password');
  } 


  onSubmit(){
 
  }
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
