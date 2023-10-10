import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/user-auth/auth.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const autoLogin = this.authService.authoLogin();
    if (autoLogin) {
      this.authService.user.subscribe(this.handleUserData);
    }
  }

  private handleUserData = (userData: any) => {
    const isAuthenticated = this.authService.isUserAuthenticated(userData);
    this.isAuthenticated = isAuthenticated;
  };
}
