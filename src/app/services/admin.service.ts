import { HttpClient, HttpParams, HttpRequest } from "@angular/common/http";
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
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  fetchRoles(paginator: PaginatorModel) {
    const pagenitorUrl = HttpHelper.setPaginatorUrl(paginator);
    return this.http.get<Wrapper<Roles>>(
      `${this.baseUrl}roles${pagenitorUrl}`
    );
  }
  fetchGroups(paginator: PaginatorModel) {
    const pagenitorUrl = HttpHelper.setPaginatorUrl(paginator);
    return this.http.get<any>(
      `${this.baseUrl}groups${pagenitorUrl}`
    );
  }

  getAllGroups(filters: any): Observable<any[]> {
    let params = new HttpParams()
      .set('Page', filters.page.toString())
      .set('Count', filters.count.toString());

    // ExactFilters
    filters.exactFilters.forEach((filter: any, index: number) => {
      params = params
        .set(`ExactFilters[${index}].propertyName`, filter.propertyName)
        .set(`ExactFilters[${index}].value`, filter.value);
    });

    // DateRangeFilters
    filters.dateRangeFilters.forEach((filter: any, index: number) => {
      params = params.set(`DateRangeFilters[${index}].propertyName`, filter.propertyName);
      if (filter.greaterThanOrEqualValue !== null) {
        params = params.set(
          `DateRangeFilters[${index}].greaterThanOrEqualValue`,
          filter.greaterThanOrEqualValue.toString()
        );
      }
      if (filter.lessThanOrEqualValue !== null) {
        params = params.set(
          `DateRangeFilters[${index}].lessThanOrEqualValue`,
          filter.lessThanOrEqualValue.toString()
        );
      }
    });

    // SortByProperties
    filters.sortByProperties.forEach((sort: any, index: number) => {
      params = params
        .set(`SortByProperties[${index}].propertyName`, sort.propertyName)
        .set(`SortByProperties[${index}].sortingType`, sort.sortingType);
    });

    return this.http.get<any[]>(`${this.baseUrl}groups`, { params });
  }
  onAddGroup(groupData: any) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}groups`,
      groupData
    );
  }
  onAddMembers(id: any, memberData: any) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}groups/${id}/members`,
      memberData
    );
  }
  getByIdGroupMembers(id: any) {
    return this.http.get<any>(
      `${this.baseUrl}groups/${id}/members`
    );
  }
  removeGroup(id: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}groups/${id}`
    );
  }

  assignQuiz(id: string, postData: any) {
    return this.http.post<any>(`${this.baseUrl}groups/${id}/quizzes`, postData);
  }

  getAssignQuiz(id: string) {
    return this.http.get<any>(`${this.baseUrl}groups/${id}/quizzes`);
  }

  assignQuizForSubtopic(id: string, postData: any) {
    return this.http.post<any>(`${this.baseUrl}subtopics/${id}/quizzes`, postData);
  }

  getAssignQuizForSubtopic(id: string) {
    return this.http.get<any>(`${this.baseUrl}subtopics/${id}/quizzes`);
  }

  getAllAttachmentsLink(paginator: PaginatorModel) {
    return this.http.get<any>(`${this.baseUrl}subtopics/attachments/links${HttpHelper.setPaginatorUrl(paginator)}`);
  }

  assignContent(id: string, postData: any) {
    return this.http.post<any>(`${this.baseUrl}groups/${id}/contents`, postData);
  }

  getAssignContent(id: string) {
    return this.http.get<any>(`${this.baseUrl}groups/${id}/contents`);
  }

  getSystemServices(paginator: PaginatorModel) {
    const pagenitorUrl = HttpHelper.setPaginatorUrl(paginator);

    return this.http.get<any>(
      `${this.baseUrl}permissions${pagenitorUrl}`
    );
  }

  addRole(roleData: RoleData) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}roles`,
      roleData
    );
  }
  getByIdRole(id: number) {
    return this.http.get<any>(
      `${this.baseUrl}roles/${id}`
    );
  }

  addLanguage(languages: any) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}languages`,
      languages
    );
  }
  updateLanguage(languages: any) {
    return this.http.put<Wrapper<any>>(
      `${this.baseUrl}languages`,
      languages
    );
  }
  fetchAllLanguage(paginator: PaginatorModel) {
    const pagenitorUrl = HttpHelper.setPaginatorUrl(paginator);
    return this.http.get<Wrapper<any>>(
      `${this.baseUrl}languages${pagenitorUrl}`
    );
  }
  updateRole(roleData: RoleData) {
    return this.http.put<Wrapper<any>>(
      `${this.baseUrl}roles`,
      roleData
    );
  }

  removeLang(id: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}languages/${id}`
    );
  }
  removeRole(roleId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}roles/${roleId}`
    );
  }
  getByIdSubject(roleId: number) {
    return this.http.get<any>(
      `${this.baseUrl}subjects/${roleId}`
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

  onRemoveCategoryTranslations(categoryId: number, languageId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}categories/${categoryId}/translations/${languageId}`
    );
  }

  onRemoveCategory(categoryId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}categories/${categoryId}`
    );
  }

  getByIdCategory(categoryId: string) {
    return this.http.get<any>(
      `${this.baseUrl}categories/${categoryId}`
    );
  }

  onAddSubject(categoryData: Category) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}subjects`,
      categoryData
    );
  }
  onRemoveSubjectTranslations(subjectId: number, languageId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}subjects/${subjectId}/translations/${languageId}`
    );
  }

  onRemoveSubject(subjectId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}subjects/${subjectId}`
    );
  }

  onAddTopic(topicData: any) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}topics`,
      topicData
    );
  }

  onRemoveTopic(topicId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}topics/${topicId}`
    );
  }

  onAddSubtopic(topicData: any) {
    return this.http.post<any>(
      `${this.baseUrl}subtopics`,
      topicData
    );
  }

  onRemoveSubtopicTranslations(subtopicId: number, languageId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}subtopics/${subtopicId}/translations/${languageId}`
    );
  }

  onRemoveSubtopic(subtopicId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}subtopics/${subtopicId}`
    );
  }

  onAddVideoAttachment(id: any, attachmentData: videoLinkForm) {
    const formData = FormUtility.createFormData(attachmentData);
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}subtopics/${id}/attachments`,
      formData
    );
  }

    onRemoveVideo(id: any, attachmentId: string) {
    return this.http.delete<Wrapper<any>>(`${this.baseUrl}subtopics/${id}/attachments/${attachmentId}`);
  }

  onDownloadAttachment(attachmentId: number) {
    return this.http.get(
      `${this.baseUrl}${API_SCHEMA.LIBRARIES}/subtopics/attachments/${attachmentId}/download`,
      {
        responseType: "blob",
      }
    );
  }
  autocomplete() {
    return this.http.get<any>(
      `${this.baseUrl}users/autocomplete`
    );
  }
  autocompleteWithFilter(filter: any) {
    return this.http.get<any>(
      `${this.baseUrl}users/autocomplete?Filter=${filter}`
    );
  }
}
