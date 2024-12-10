import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LibraryService } from "src/app/services/library.service";
import { CategoryResult } from "../admin/models/category";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { PaginatorModel } from "../models/Base/FetchBaseModel";

@Component({
  selector: "app-main-home",
  templateUrl: "./main-home.component.html",
  styleUrls: ["./main-home.component.scss"],
})
export class MainHomeComponent implements OnInit {
  paginatorModel: PaginatorModel;

  constructor(
    private router: Router,
    private libraryService: LibraryService,
    private localStorageService: LocalStorageService
  ) {
    this.paginatorModel = {
    count: 100,
    page: 1,
  };

  }
  ngOnInit(): void {
    this.onGetAllCategories();
  }
  categories: CategoryResult[] = [];
  onNavigate(categoryId: number) {
    this.localStorageService.setItem("categoryId", categoryId);
    this.router.navigate(["/main-teacher-management/module-category"]);
  }

  onGetAllCategories(): void {
    this.libraryService.fetchAllCategories(this.paginatorModel).subscribe({
      next: (response) => {
        this.categories = response.result.data;
      },
    });
  }
}
