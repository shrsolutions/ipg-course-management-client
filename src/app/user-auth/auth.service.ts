import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  exhaustMap,
  take,
  tap,
  throwError,
} from "rxjs";
import { environment } from "src/environments/environment.development";
import { AuthResult, User } from "./user-model";
import { LocalStorageService } from "../shared/services/local-storage.service";
import { Router } from "@angular/router";
import { NotificationService } from "../shared/services/notification.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  baseUrl = environment.apiUrl;
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  signup(registerModel) {
    const formData = this.createFormData(registerModel);

    return this.http
      .post<AuthResult>(`${this.baseUrl}app/users/register`, formData)
      .pipe(
        catchError(this.handleError),
        tap((resData) => this.handleAuthentication(resData))
      );
  }

  signIn(loginModel) {
    return this.http
      .post<AuthResult>(`${this.baseUrl}auth/login`, loginModel)
      .pipe(
        catchError(this.handleError),
        tap((resData) => this.handleAuthentication(resData))
      );
  }

  signOut(): void {
    this.user.next(null);
    this.router.navigate(["/auth/login"]);
    this.localStorageService.removeItem("user");
  }

  confirmCode(confirmCode: string) {
    return this.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = this.createAuthorizationHeader(user?.token);
        const options = { headers };

        return this.http.post<AuthResult>(
          `${this.baseUrl}app/users/confirm-email/${confirmCode}`,
          null,
          options
        );
      })
    );
  }

  authoLogin(): boolean {
    const userData = this.localStorageService.getItem<any>("user");
    if (!userData) {
      return false;
    }
    const loadedUser = User.createUserInstanceFromLocalStorage(userData);
    if (loadedUser.token) {
      this.user.next(loadedUser);
      return true;
    }
    return false;
  }

  isUserAuthenticated(userData: any): boolean {
    const userStatusId = userData.userStatusId ?? 1;
    return userStatusId === 2;
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An Unknown error occured!";
    console.log(!errorRes.error, !errorRes.error);
    if (!errorRes.error) {
      return throwError(() => errorMessage);
    }
    console.log(errorRes.error.messages);
    for (const message of errorRes.error.messages) {
      switch (message) {
        case "IncorrectEmailOrPassword":
          errorMessage = "Incorrect email and password";
          break;

        default:
          break;
      }
    }
    this.localStorageService.setItem("asd", "asd");
    return throwError(() => errorMessage);
  }

  private handleAuthentication(userData: AuthResult) {
    const user = User.createUserInstance(userData.result);
    this.user.next(user);
    this.localStorageService.setItem("user", user);
  }

  private createFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return formData;
  }

  private createAuthorizationHeader(token?: string): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    });
  }
}
