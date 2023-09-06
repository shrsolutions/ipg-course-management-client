import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmailAlertComponent } from './email-alert/email-alert.component';

const userRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'email-alert', component: EmailAlertComponent },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(userRoutes)]
  ],
  exports:[RouterModule]
})
export class AuthRoutingModule { }
