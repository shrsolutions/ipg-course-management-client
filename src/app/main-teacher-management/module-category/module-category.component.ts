import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-module-category",
  templateUrl: "./module-category.component.html",
  styleUrls: ["./module-category.component.scss"],
})
export class ModuleCategoryComponent {
  /**
   *
   */
  constructor(private router: Router) {}
  onNavigate() {
    this.router.navigate(["/videos/subject"]);
  }
}
