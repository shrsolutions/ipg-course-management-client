import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { PaginatorModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";
import { TopicList } from "src/app/main-teacher-management/models/library-models/topic";
import { AdminService } from "src/app/services/admin.service";
import { LibraryService } from "src/app/services/library.service";

@Component({
  selector: "app-topic-videos",
  templateUrl: "./topic-videos.component.html",
  styleUrls: ["./topic-videos.component.scss"],
})
export class TopicVideosComponent implements OnInit {
  subjectId: number;
  displayedColumns: string[] = ["topicId", "translation", "languageName"];
  dataSource: MatTableDataSource<TopicList> = new MatTableDataSource<
    TopicList
  >();
  paginatorModel: PaginatorModel

  constructor(
    private libraryService: LibraryService,
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {
    this.paginatorModel = {
      count: 100,
      page: 1,
    };
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subjectId = params["id"];
      this.onLoadTopics(this.subjectId);
    });
  }

  onLoadTopics(subjectId: number): void {
    if (subjectId != null && subjectId !== undefined) {
      this.libraryService.fetchTopicsBySubjectId(subjectId,this.paginatorModel).subscribe({
        next: (response) => {
          const data = response.result.data;
          this.dataSource.data = data;
        },
      });
    }
  }
}
