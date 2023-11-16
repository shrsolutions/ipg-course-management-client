import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LibraryService } from "src/app/services/library.service";
import { CategoryResult } from "../admin/models/category";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";

@Component({
  selector: "app-main-home",
  templateUrl: "./main-home.component.html",
  styleUrls: ["./main-home.component.scss"],
})
export class MainHomeComponent implements OnInit {
  constructor(
    private router: Router,
    private libraryService: LibraryService,
    private localStorageService: LocalStorageService
  ) {}
  ngOnInit(): void {
    this.onGetAllCategories();
  }
  categories: CategoryResult[] = [];
  onNavigate(categoryId: number) {
    this.localStorageService.setItem("categoryId", categoryId);
    this.router.navigate(["/main-teacher-management/module-category"]);
  }

  onGetAllCategories(): void {
    this.libraryService.fetchAllCategories().subscribe({
      next: (response) => {
        this.categories = response.result;
      },
    });
  }
}
