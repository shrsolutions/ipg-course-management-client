import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-module-category",
  templateUrl: "./module-category.component.html",
  styleUrls: ["./module-category.component.scss"],
})
export class ModuleCategoryComponent {
  constructor(private router: Router) {}
  modulesNavs = {
    1: "videos/subject",
    2: "topics",
    3: "quizzes",
  };
  onNavigate(moduleId) {
    this.router.navigate([
      `/main-teacher-management/teacher-module/${this.modulesNavs[moduleId]}`,
    ]);
  }
}
