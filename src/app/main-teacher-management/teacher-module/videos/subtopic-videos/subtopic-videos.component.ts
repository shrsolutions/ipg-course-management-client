import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
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
  displayedColumns: string[] = ["subtopicId", "translation", "languageName"];

  constructor(
    private libraryService: LibraryService,
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.topicId = +params["id"];
      this.onLoadSubtopics(this.topicId);
    });
  }

  onLoadSubtopics(topicId: number) {
    this.libraryService.fetchSubTopicsByTopicId(topicId).subscribe({
      next: (response) => {
        const responseData = response.result;
        this.dataSource.data = responseData;
      },
    });
  }
}
