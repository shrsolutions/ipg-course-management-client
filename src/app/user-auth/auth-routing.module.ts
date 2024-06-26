import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { EmailAlertComponent } from "./email-alert/email-alert.component";
import { ConfirmAccountComponent } from "./confirm-account/confirm-account.component";
import { AuthComponent } from "./auth.component";

const userRoutes: Routes = [
  { path: "", redirectTo: "auth", pathMatch: "full" },
  {
    path: "auth",
    component: AuthComponent,
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "forgot-password", component: ForgotPasswordComponent },
      { path: "email-alert", component: EmailAlertComponent },
      { path: "confirm-account", component: ConfirmAccountComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [[RouterModule.forChild(userRoutes)]],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
