import { PaginatorModel } from "src/app/main-teacher-management/models/Base/FetchBaseModel";

export default class HttpHelper {
  static setPaginatorUrl(paginator: PaginatorModel): string {
    return `?Page=${paginator.page}&Count=${paginator.count}`;
  }
}
