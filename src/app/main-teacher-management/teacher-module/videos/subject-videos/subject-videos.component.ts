import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SubjectList } from "src/app/main-teacher-management/admin/models/subject";
import { LibraryService } from "src/app/services/library.service";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";

@Component({
  selector: "app-subject-videos",
  templateUrl: "./subject-videos.component.html",
  styleUrls: ["./subject-videos.component.scss"],
})
export class SubjectVideosComponent implements OnInit {
  displayedColumns: string[] = ["subjectId", "translation", "languageName"];
  dataSource: MatTableDataSource<SubjectList> = new MatTableDataSource<
    SubjectList
  >();

  constructor(
    private libraryService: LibraryService,
    private locaStorageService: LocalStorageService
  ) {}
  ngOnInit(): void {
    this.onLoadSubject();
  }

  onLoadSubject(): void {
    const categoryId = this.locaStorageService.getItem<number>("categoryId");
    this.libraryService.fetchSubjectsByCategoryId(categoryId).subscribe({
      next: (responseData) => {
        const data = responseData.result;
        this.dataSource.data = data;
      },
    });
  }
}
