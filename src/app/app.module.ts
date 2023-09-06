import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserAuthModule } from './user-auth/user-auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainTeacherManagementModule } from './main-teacher-management/main-teacher-management.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UserAuthModule,
    MainTeacherManagementModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
