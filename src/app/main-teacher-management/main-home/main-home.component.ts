import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-main-home",
  templateUrl: "./main-home.component.html",
  styleUrls: ["./main-home.component.scss"],
})
export class MainHomeComponent {
  /**
   *
   */
  constructor(private router: Router) {}
  onNavigate() {
    this.router.navigate(["/main-teacher-management/module-category"]);
  }
}
