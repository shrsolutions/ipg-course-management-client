import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmailAlertComponent } from './email-alert/email-alert.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
@NgModule({
  declarations:
  [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    EmailAlertComponent,
    ConfirmAccountComponent,
  ],
  imports: [
    SharedModule,
    MatCardModule,
    MatIconModule,
    AuthRoutingModule,
    FormsModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    EmailAlertComponent
  ]

})
export class UserAuthModule { }
