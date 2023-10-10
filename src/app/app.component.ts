import { Component, OnInit } from "@angular/core";
import { AuthService } from "./user-auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
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

  title = "IpgCourseManagement-App";
}
