import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const userRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(userRoutes)]
  ],
  exports:[RouterModule]
})
export class AuthRoutingModule { }
