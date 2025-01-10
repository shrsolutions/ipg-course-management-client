import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { LibraryService } from "src/app/services/library.service";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { SubjectList } from "../../admin/models/subject";
import { PaginatorModel } from "../../models/Base/FetchBaseModel";

@Component({
  selector: "app-topic",
  templateUrl: "./topic.component.html",
  styleUrls: ["./topic.component.scss"],
})
export class TopicComponent implements OnInit {
  displayedColumns: string[] = [ "translation"];
  dataSource: MatTableDataSource<SubjectList> = new MatTableDataSource<
    SubjectList
  >();
  paginatorModel: PaginatorModel
  constructor(
    private libraryService: LibraryService,
    private locaStorageService: LocalStorageService,

  ) {
    this.paginatorModel = {
      count: 100,
      page: 1,
    };
  }
  ngOnInit(): void {
    this.onLoadSubject();
  }

  onLoadSubject(): void {
    const categoryId = this.locaStorageService.getItem<number>("categoryId");
    this.libraryService.fetchSubjectsByCategoryId(categoryId,this.paginatorModel).subscribe({
      next: (responseData) => {
        const data = responseData.result.data;
        this.dataSource.data = data;
      },
    });
  }
}
