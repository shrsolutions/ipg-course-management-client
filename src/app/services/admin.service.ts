import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PaginatorModel,
  SelectBoxModel,
  Wrapper,
  WrapperWithoutCount,
} from "../main-teacher-management/models/Base/FetchBaseModel";
import {
  Roles,
  Users,
} from "../main-teacher-management/models/admin-models/role.model";
import { environment } from "src/environments/environment.development";
import HttpHelper from "../shared/helper/httpHelper";
import { API_SCHEMA } from "../shared/enums/api-enum";
import { RoleData } from "../main-teacher-management/admin/models/role";
import {
  Category,
  CategoryResult,
} from "../main-teacher-management/admin/models/category";
import { TopicForm } from "../main-teacher-management/models/library-models/topic";
import { SubtopicForm } from "../main-teacher-management/models/library-models/subtopic";
import { videoLinkForm } from "../main-teacher-management/models/library-models/video-link";
import FormUtility from "../shared/utility/form-utility";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  fetchRoles(paginator: PaginatorModel) {
    const pagenitorUrl = HttpHelper.setPaginatorUrl(paginator);
    return this.http.get<Wrapper<Roles>>(
      `${this.baseUrl}roles${pagenitorUrl}`
    );
  }

  getSystemServices() {
    return this.http.get<WrapperWithoutCount<SelectBoxModel>>(
      `${this.baseUrl}system-services`
    );
  }

  addRole(roleData: RoleData) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}roles`,
      roleData
    );
  }

  updateRole(roleData: RoleData) {
    return this.http.put<Wrapper<any>>(
      `${this.baseUrl}roles`,
      roleData
    );
  }

  removeRole(roleId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}roles/${roleId}`
    );
  }

  fetchAllUsers(paginator: PaginatorModel) {
    const pagenitorUrl = HttpHelper.setPaginatorUrl(paginator);
    return this.http.get<Wrapper<Users>>(
      `${this.baseUrl}users${pagenitorUrl}`
    );
  }

  onSetNewRoleToUser(userId: number, roleIds: any) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}users/${userId}/set-roles`,
      roleIds
    );
  }

  onUserActivate(userId: number) {
    return this.http.put<Wrapper<any>>(
      `${this.baseUrl}users/${userId}/activate`,
      {}
    );
  }

  onUserBlock(userId: number) {
    return this.http.put<Wrapper<any>>(
      `${this.baseUrl}users/${userId}/block`,
      {}
    );
  }

  onAddCategory(categoryData: any) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}categories`,
      categoryData
    );
  }

  onRemoveCategory(categoryId: number, languageId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}categories/${categoryId}/translations/${languageId}`
    );
  }

  onAddSubject(categoryData: Category) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}subjects`,
      categoryData
    );
  }
  onRemoveSubject(subjectId: number, languageId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}subjects/${subjectId}/translations/${languageId}`
    );
  }

  onAddTopic(topicData: TopicForm) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}topics`,
      topicData
    );
  }

  onAddSubtopic(topicData: SubtopicForm) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.ADMIN}/${API_SCHEMA.TRANSLATION}/subtopics`,
      topicData
    );
  }

  onRemoveSubtopic(subtopicId: number, languageId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.ADMIN}/${API_SCHEMA.TRANSLATION}/subtopics/${subtopicId}/languages/${languageId}`
    );
  }

  onAddVideoAttachment(attachmentData: videoLinkForm) {
    const formData = FormUtility.createFormData(attachmentData);

    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.ADMIN}/subtopics/attachments`,
      formData
    );
  }

  onDownloadAttachment(attachmentId: number) {
    return this.http.get(
      `${this.baseUrl}${API_SCHEMA.LIBRARIES}/subtopics/attachments/${attachmentId}/download`,
      {
        responseType: "blob",
      }
    );
  }
}
