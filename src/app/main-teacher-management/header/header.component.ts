import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/user-auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const autoLogin = this.authService.authoLogin();
    if (autoLogin) {
      this.authService.user.subscribe(this.handleUserData);
    }
  }

  onSignOut(): void {
    this.authService.signOut();
  }

  private handleUserData = (userData: any) => {
    const isAuthenticated = this.authService.isUserAuthenticated(userData);
    this.isAuthenticated = isAuthenticated;
  };
}
