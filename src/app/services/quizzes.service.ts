import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { PaginatorModel } from '../main-teacher-management/models/Base/FetchBaseModel';
import HttpHelper from '../shared/helper/httpHelper';
import { Observable } from 'rxjs';
interface ImageUploadResponse {
  result: {
    id: string;
    downloadLink: string;
  };
}
@Injectable({
  providedIn: 'root'
})
export class QuizzesService {

  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

getAllQuizzes(
    paginator: { page: number; count: number },
    filters?: {
      SubjectId?: string;
      TopicId?: string;
      SubtopicId?: string;
    }
  ) {
    let params = new HttpParams()
      .set('Page', paginator.page.toString())
      .set('Count', paginator.count.toString());

    // Əgər filterlər ötürülübsə və varsa, əlavə et
    if (filters) {
      if (filters.SubjectId) {
        params = params.set('SubjectId', filters.SubjectId);
      }
      if (filters.TopicId) {
        params = params.set('TopicId', filters.TopicId);
      }
      if (filters.SubtopicId) {
        params = params.set('SubtopicId', filters.SubtopicId);
      }
    }

    return this.http.get<any>(`${this.baseUrl}quizzes`, { params });
  }

  getAllQuizzes2(filters: any): Observable<any[]> {
    let params = new HttpParams()
      .set('Page', filters.page.toString())
      .set('Count', filters.count.toString());

    // ExactFilters
    filters.exactFilters.forEach((filter: any, index: number) => {
      params = params
        .set(`ExactFilters[${index}].propertyName`, filter.propertyName)
        .set(`ExactFilters[${index}].value`, filter.value);
    });

    // IntegerRangeFilters
    filters.integerRangeFilters.forEach((filter: any, index: number) => {
      params = params.set(`IntegerRangeFilters[${index}].propertyName`, filter.propertyName);
      if (filter.greaterThanOrEqualValue !== null) {
        params = params.set(
          `IntegerRangeFilters[${index}].greaterThanOrEqualValue`,
          filter.greaterThanOrEqualValue.toString()
        );
      }
      if (filter.lessThanOrEqualValue !== null) {
        params = params.set(
          `IntegerRangeFilters[${index}].lessThanOrEqualValue`,
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

    return this.http.get<any[]>(`${this.baseUrl}quizzes`, { params });
  }

  addQuizz(postData: any) {
    return this.http.post<any>(`${this.baseUrl}quizzes`, postData);
  }

  editQuizz(postData: any, quizzId: string) {
    return this.http.put<any>(`${this.baseUrl}quizzes/${quizzId}`, postData);
  }

  getQuizzById( quizzId: string) {
    return this.http.get<any>(`${this.baseUrl}quizzes/${quizzId}`);
  }

  removeQuizz( quizzId: number) {
    return this.http.delete<any>(`${this.baseUrl}quizzes/${quizzId}`);
  }


  // QUESTIONS
  getAllQuestions(paginator: PaginatorModel) {
    return this.http.get<any>(`${this.baseUrl}questions${HttpHelper.setPaginatorUrl(paginator)}`);
  }

  addQuestion(postData: any) {
    return this.http.post<any>(`${this.baseUrl}questions`, postData);
  }

  editQuestion(postData: any, questionId: number) {
    return this.http.put<any>(`${this.baseUrl}questions/${questionId}`, postData);
  }

  getQuestionById( questionId: string) {
    return this.http.get<any>(`${this.baseUrl}questions/${questionId}`);
  }

  removeQuestion( questionId: number) {
    return this.http.delete<any>(`${this.baseUrl}questions/${questionId}`);
  }

  uploadImage(formData: FormData): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}questions/images`, formData);
  }

}
