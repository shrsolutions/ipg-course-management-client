import { Component, OnInit } from "@angular/core";
import { AuthService } from "../user-auth/auth.service";
import { LoadingService } from "../shared/services/loading.service";

@Component({
  selector: "app-main-teacher-management",
  templateUrl: "./main-teacher-management.component.html",
  styleUrls: ["./main-teacher-management.component.scss"],
})
export class MainTeacherManagementComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const autoLogin = this.authService.authoLogin();
    if (autoLogin) {
      this.authService.user.subscribe(this.handleUserData);
    }
    console.log(this.isAuthenticated);
  }

  private handleUserData = (userData: any) => {
    console.log(userData);
    const isAuthenticated = this.authService.isUserAuthenticated(userData);
    this.isAuthenticated = isAuthenticated;
  };
}
