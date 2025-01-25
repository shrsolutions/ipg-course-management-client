import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { PaginatorModel } from '../main-teacher-management/models/Base/FetchBaseModel';
import HttpHelper from '../shared/helper/httpHelper';

@Injectable({
  providedIn: 'root'
})
export class QuizzesService {

  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllQuizzes(paginator: PaginatorModel) {
    return this.http.get<any>(`${this.baseUrl}quizzes${HttpHelper.setPaginatorUrl(paginator)}`);
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

}
