import { Component, OnInit } from "@angular/core";
import { AuthService } from "../user-auth/auth.service";

@Component({
  selector: "app-main-teacher-management",
  templateUrl: "./main-teacher-management.component.html",
  styleUrls: ["./main-teacher-management.component.scss"],
})
export class MainTeacherManagementComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const autoLogin = this.authService.authoLogin();
    if (autoLogin) {
      this.authService.user.subscribe(this.handleUserData);
    }
  }

  private handleUserData = (userData: any) => {
    console.log(userData);
    const isAuthenticated = this.authService.isUserAuthenticated(userData);
    this.isAuthenticated = isAuthenticated;
  };
}
