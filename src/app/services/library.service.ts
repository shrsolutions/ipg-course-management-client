import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { PaginatorModel, WrapperWithoutCount } from "../main-teacher-management/models/Base/FetchBaseModel";
import { CategoryResult } from "../main-teacher-management/admin/models/category";
import { API_SCHEMA } from "../shared/enums/api-enum";
import { SubjectList } from "../main-teacher-management/admin/models/subject";
import { TopicList } from "../main-teacher-management/models/library-models/topic";
import { SubtopicList } from "../main-teacher-management/models/library-models/subtopic";
import { VideoLinkList } from "../main-teacher-management/models/library-models/video-link";
import HttpHelper from "../shared/helper/httpHelper";

@Injectable({
  providedIn: "root",
})
export class LibraryService {
  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  fetchAllCategories(paginator: PaginatorModel) {
    const pagenitorUrl = HttpHelper.setPaginatorUrl(paginator);

    return this.http.get<any>(
      `${this.baseUrl}categories${pagenitorUrl}`
    );
  }
  fetchUserData() {
    return this.http.get<any>( `${this.baseUrl}users/profile`
    );
  }

  fetchSubjectsByCategoryId(categoryId: string,paginator?: PaginatorModel) {
    const pagenitorUrl = HttpHelper.setPaginatorUrl(paginator);

    return this.http.get<any>(
      `${this.baseUrl}subjects?CategoryId=${categoryId}&Page=${paginator.page}&Count=${paginator.count}`
    );
  }

  fetchTopicsBySubjectId(subjectId: string,paginator?: PaginatorModel) {
    return this.http.get<any>(
      `${this.baseUrl}topics?SubjectId=${subjectId}&Page=${paginator.page}&Count=${paginator.count}`
    );
  }

  fetchSubTopicsByTopicId(topicId: string,paginator?: PaginatorModel) {
    return this.http.get<any>(
      `${this.baseUrl}subtopics?TopicId=${topicId}&Page=${paginator.page}&Count=${paginator.count}`
    );
  }

  fetchAttachmentsBySubtopicId(subtopicId: number) {
    return this.http.get<any>(
      `${this.baseUrl}subtopics/${subtopicId}/attachments`
    );
  }
}
