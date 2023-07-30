// register.component.ts
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  hidePassword = true;
  invalid:boolean=false;

  constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
     this.initialForm();
    }


    initialForm(){
      this.registrationForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', (Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&]{8,}$/))],
        confirmPassword: [null, Validators.required],
      }, { validator: this.confirmPasswordValidator() });
    }

    confirmPasswordValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: false };
      };
    }

  onSubmit() {

    console.log(this.registrationForm.get('confirmPassword').touched)
    console.log(this.registrationForm.errors?.['passwordMismatch'])
    console.log(this.registrationForm)

    if (this.registrationForm.invalid) {
      this.invalid = true
      console.log('Valid',this.invalid)
      return;
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
