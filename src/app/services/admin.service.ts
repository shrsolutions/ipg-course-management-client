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

@Injectable({
  providedIn: "root",
})
export class AdminService {
  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  fetchRoles(paginator: PaginatorModel) {
    const pagenitorUrl = HttpHelper.setPaginatorUrl(paginator);
    return this.http.get<Wrapper<Roles>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/roles${pagenitorUrl}`
    );
  }

  getSystemServices() {
    return this.http.get<WrapperWithoutCount<SelectBoxModel>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/system-services`
    );
  }

  addRole(roleData: RoleData) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/roles`,
      roleData
    );
  }

  updateRole(roleData: RoleData) {
    return this.http.put<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/roles`,
      roleData
    );
  }

  removeRole(roleId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/roles/${roleId}`
    );
  }

  fetchAllUsers(paginator: PaginatorModel) {
    const pagenitorUrl = HttpHelper.setPaginatorUrl(paginator);
    return this.http.get<Wrapper<Users>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/users${pagenitorUrl}`
    );
  }

  onSetNewRoleToUser(userId: number, roleIds: any) {
    return this.http.put<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/users/${userId}/roles`,
      roleIds
    );
  }

  onUserActivate(userId: number) {
    return this.http.put<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/users/${userId}/activate`,
      {}
    );
  }

  onUserBlock(userId: number) {
    return this.http.put<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/users/${userId}/block`,
      {}
    );
  }

  onAddCategory(categoryData: Category) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/${API_SCHEMA.TRANSLATION}/categories`,
      categoryData
    );
  }

  onRemoveCategory(categoryId: number, languageId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/${API_SCHEMA.TRANSLATION}/categories/${categoryId}/languages/${languageId}`
    );
  }

  onAddSubject(categoryData: Category) {
    return this.http.post<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/${API_SCHEMA.TRANSLATION}/subjects`,
      categoryData
    );
  }
  onRemoveSubject(subjectId: number, languageId: number) {
    return this.http.delete<Wrapper<any>>(
      `${this.baseUrl}${API_SCHEMA.APP}/${API_SCHEMA.ADMIN}/${API_SCHEMA.TRANSLATION}/subjects/${subjectId}/languages/${languageId}`
    );
  }
}
