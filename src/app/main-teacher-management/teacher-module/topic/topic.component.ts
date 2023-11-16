import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { LibraryService } from "src/app/services/library.service";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { SubjectList } from "../../admin/models/subject";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-topic",
  templateUrl: "./topic.component.html",
  styleUrls: ["./topic.component.scss"],
})
export class TopicComponent implements OnInit {
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
