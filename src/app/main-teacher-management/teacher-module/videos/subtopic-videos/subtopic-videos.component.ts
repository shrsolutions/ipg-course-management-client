import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { PaginatorModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";
import { SubtopicList } from "src/app/main-teacher-management/models/library-models/subtopic";
import { AdminService } from "src/app/services/admin.service";
import { LibraryService } from "src/app/services/library.service";

@Component({
  selector: "app-subtopic-videos",
  templateUrl: "./subtopic-videos.component.html",
  styleUrls: ["./subtopic-videos.component.scss"],
})
export class SubtopicVideosComponent implements OnInit {
  dataSource: MatTableDataSource<SubtopicList> = new MatTableDataSource<
    SubtopicList
  >();

  categoryId = 0;
  editedSubject;
  topicId: number;
  displayedColumns: string[] = [ "translation"];
  paginatorModel: PaginatorModel

  constructor(
    private libraryService: LibraryService,
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {  this.paginatorModel = {
    count: 100,
    page: 1,
  };}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.topicId = params["id"];
      this.onLoadSubtopics(this.topicId);
    });
  }

  onLoadSubtopics(topicId: number) {
    this.libraryService.fetchSubTopicsByTopicId(topicId,this.paginatorModel).subscribe({
      next: (response) => {
        const responseData = response.result.data;
        this.dataSource.data = responseData;
      },
    });
  }
}
