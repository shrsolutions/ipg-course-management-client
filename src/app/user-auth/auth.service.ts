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
import FormUtility from "../shared/utility/form-utility";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  baseUrl = environment.apiUrl;
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  signup(registerModel) {
    const formData = FormUtility.createFormData(registerModel);

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
      .pipe(tap((resData) => this.handleAuthentication(resData)));
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
    debugger
    const userStatusId = userData.userStatusId ?? 2;
    return userStatusId === 3;
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An Unknown error occured!";
    if (!errorRes.error) {
      return throwError(() => errorMessage);
    }

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
    console.log(userData);
    const user = User.createUserInstance(userData.result);
    this.user.next(user);
    this.localStorageService.setItem("user", user);
  }

  private createAuthorizationHeader(token?: string): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    });
  }
}
