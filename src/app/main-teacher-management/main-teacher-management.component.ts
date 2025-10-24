import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "../user-auth/auth.service";
import { LoadingService } from "../shared/services/loading.service";

@Component({
  selector: "app-main-teacher-management",
  templateUrl: "./main-teacher-management.component.html",
  styleUrls: ["./main-teacher-management.component.scss"],
})
export class MainTeacherManagementComponent implements OnInit, AfterContentChecked {
  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const autoLogin = this.authService.authoLogin();
    if (autoLogin) {
      this.authService.user.subscribe(this.handleUserData);
    }
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges()
  }

  private handleUserData = (userData: any) => {
    const isAuthenticated = this.authService.isUserAuthenticated(userData);
    this.isAuthenticated = isAuthenticated;
  };
}
