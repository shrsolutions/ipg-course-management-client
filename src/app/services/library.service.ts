import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { WrapperWithoutCount } from "../main-teacher-management/models/Base/FetchBaseModel";
import { CategoryResult } from "../main-teacher-management/admin/models/category";
import { API_SCHEMA } from "../shared/enums/api-enum";
import { SubjectList } from "../main-teacher-management/admin/models/subject";
import { TopicList } from "../main-teacher-management/models/library-models/topic";
import { SubtopicList } from "../main-teacher-management/models/library-models/subtopic";
import { VideoLinkList } from "../main-teacher-management/models/library-models/video-link";

@Injectable({
  providedIn: "root",
})
export class LibraryService {
  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  fetchAllCategories() {
    return this.http.get<WrapperWithoutCount<CategoryResult>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.LIBRARIES}/categories`
    );
  }

  fetchSubjectsByCategoryId(categoryId: number) {
    return this.http.get<WrapperWithoutCount<SubjectList>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.LIBRARIES}/categories/${categoryId}/subjects`
    );
  }

  fetchTopicsBySubjectId(subjectId: number) {
    return this.http.get<WrapperWithoutCount<TopicList>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.LIBRARIES}/subjects/${subjectId}/topics`
    );
  }

  fetchSubTopicsByTopicId(topicId: number) {
    return this.http.get<WrapperWithoutCount<SubtopicList>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.LIBRARIES}/topics/${topicId}/subtopics`
    );
  }

  fetchAttachmentsBySubtopicId(subtopicId: number) {
    return this.http.get<WrapperWithoutCount<VideoLinkList>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.LIBRARIES}/subtopics/${subtopicId}/attachments`
    );
  }
}
