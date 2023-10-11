import { Component, OnInit } from "@angular/core";
import { AuthService } from "./user-auth/auth.service";
import { LoadingService } from "./shared/services/loading.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(public loadingService: LoadingService) {}

  ngOnInit(): void {}

  title = "IpgCourseManagement-App";
}
