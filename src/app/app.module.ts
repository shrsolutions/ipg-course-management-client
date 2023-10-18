import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { UserAuthModule } from "./user-auth/user-auth.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainTeacherManagementModule } from "./main-teacher-management/main-teacher-management.module";
import { TeacherRoutingModule } from "./main-teacher-management/teacher-routing.module";
import { ToastrModule } from "ngx-toastr";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorHandlingInterceptor } from "./core/interceptors/error-handling.interceptor";
import { HttpLoadingInterceptor } from "./core/interceptors/http-loading.interceptor";
import { TokenInterceptor } from "./core/interceptors/token.interceptor";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UserAuthModule,
    TeacherRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
