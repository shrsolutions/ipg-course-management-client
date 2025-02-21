import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { AuthService } from "src/app/user-auth/auth.service";
import { User } from "src/app/user-auth/user-model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const autoLogin = this.authService.authoLogin();
    if (autoLogin) {
      this.authService.user.subscribe(this.handleUserData);
    }
    this.DownloadFile()

  }

  onSignOut(): void {
    this.authService.signOut();
  }
  profileImageUrl: string = 'assets/images/users/user-1.jpg'; // Default image

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profileImageUrl']) {
      console.log('Sidebar image updated:', this.profileImageUrl);
    }
  }
  DownloadFile() {

    this.authService.getProfileImage().subscribe({
      next: (response) => {

        const blob = new Blob([response], { type: 'image/jpg' });
        var fileURL = URL.createObjectURL(blob)
        this.profileImageUrl = fileURL; // Update the image URL

      },
    });

  }
  private handleUserData = (userData: User) => {
    const isAuthenticated = this.authService.isUserAuthenticated(userData);
    this.userFullName = userData.fullName;
    console.log(userData)
    this.isAuthenticated = isAuthenticated;
  };
}
