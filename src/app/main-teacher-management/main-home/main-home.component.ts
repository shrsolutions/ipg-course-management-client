import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LibraryService } from "src/app/services/library.service";
import { CategoryResult } from "../admin/models/category";

@Component({
  selector: "app-main-home",
  templateUrl: "./main-home.component.html",
  styleUrls: ["./main-home.component.scss"],
})
export class MainHomeComponent implements OnInit {
  constructor(private router: Router, private libraryService: LibraryService) {}
  ngOnInit(): void {
    this.onGetAllCategories();
  }
  categories: CategoryResult[] = [];
  onNavigate() {
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
