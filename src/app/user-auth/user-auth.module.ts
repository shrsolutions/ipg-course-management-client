import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { SharedModule } from "../shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { FormsModule } from "@angular/forms";
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { EmailAlertComponent } from "./email-alert/email-alert.component";
import { ConfirmAccountComponent } from "./confirm-account/confirm-account.component";
import { AuthComponent } from "./auth.component";
import { IMaskModule } from "angular-imask";
import { NgOtpInputModule } from "ng-otp-input";
import { ConfirmForgotPasswordComponent } from "./confirm-forgot-password/confirm-forgot-password.component";
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    EmailAlertComponent,
    ConfirmAccountComponent,
    ConfirmForgotPasswordComponent,
    AuthComponent,
  ],
  imports: [
    SharedModule,
    MatCardModule,
    MatIconModule,
    AuthRoutingModule,
    FormsModule,
    IMaskModule,
    NgOtpInputModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    EmailAlertComponent,
    ConfirmAccountComponent,
  ],
})
export class UserAuthModule {}
