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
import { Observable } from 'rxjs'
import { Wrapper } from "../main-teacher-management/models/Base/FetchBaseModel";
import { showInfoAlert } from "../shared/helper/alert";
import * as CryptoJS from 'crypto-js';

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
  ) { }

  signup(registerModel) {
    return this.http
      .post<any>(`${this.baseUrl}users/register`, registerModel)
      .pipe(
        catchError(this.handleError),
        tap((resData) => this.handleAuthentication(resData))
      );
  }
  addStudent(registerModel: any) {
    const formData = FormUtility.createFormData(registerModel);

    return this.http
      .post<Wrapper<any>>(`${this.baseUrl}users/register/student`, formData)

  }
  editProfile(registerModel: any) {

    return this.http
      .put<any>(`${this.baseUrl}users/profile`, registerModel)

  }
  postProfileImage(image: any) {

    return this.http
      .post<any>(`${this.baseUrl}users/profile/image`, image)

  }
  signIn(loginModel) {
    return this.http
      .post<any>(`${this.baseUrl}auth/login`, loginModel)
      .pipe(tap((resData) => this.handleAuthentication(resData)));
  }

  twoStepVerify(registerModel: any) {
    return this.http.post<any>(`${this.baseUrl}auth/two-step/verify`, registerModel).pipe(tap((resData) => this.handleAuthenticationTwoStep(resData)));
  }


  resendConfirmCode(key: string) {
    return this.http.post<any>(`${this.baseUrl}auth/two-step/resend-confirm-code/${key}`, null)
  }

  resendConfirmCodeForgotPassword(key: string) {
    return this.http.post<any>(`${this.baseUrl}auth/password-change/resend-confirm-code/${key}`, null)
  }

  sendForgotPasswordCode(postData: any) {
    return this.http.post<any>(`${this.baseUrl}auth/password-change/send-confirm-code`, postData)
  }


  verifyForgotPasswordOtp(postData: any) {
    return this.http.post<any>(`${this.baseUrl}auth/password-change/verify`, postData);
  }

refreshTokenApi(refreshToken: { activeRefreshToken: string }) {
  return this.http.post<any>(`${this.baseUrl}auth/refresh-token`, refreshToken);
}

  signOut(): void {
    this.user.next(null);
    this.router.navigate(["/auth/login"]);
    this.localStorageService.removeItem("user");
    this.localStorageService.removeItem("userPermission");

  }

  confirmCode(confirmCode: string) {
    return this.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = this.createAuthorizationHeader(user?.token);
        const options = { headers };

        return this.http.post<AuthResult>(
          `${this.baseUrl}users/confirm-email/${confirmCode}`,
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
    const userStatusId = userData?.userStatusId ?? 2;
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

  private handleAuthentication(userData: any) {

    if (userData.result.authenticatedUser.userType == 2) {
      showInfoAlert("Info", "You do not have permission to access the system.", true, false, '', 'Close')
      return
    }
    if (userData.result.authenticatedUser.userStatusId == 2) {
      showInfoAlert("Info", "Hesabınız təsdiqləndikdən sonra sistemə giriş edə bilərsiniz", true, false, '', 'Close')
      return
    }
    if (userData.result.twoStepAuthRequired) {
      this.encryptAndStore(userData.result.twoStepAuthKey)
      this.router.navigate(["/auth/confirm-account"]);
    } else {
      this.router.navigate(["/main-teacher-management/main-home"])
      setTimeout(() => {
        location.reload()
      }, 200);
    }
    if (!userData.result.twoStepAuthRequired) {
      const user = User.createUserInstance(userData.result.authenticatedUser);
      const userPermission = userData.result.authenticatedUser.permissions;
      this.user.next(user);
      this.localStorageService.setItem("user", user);
      this.localStorageService.setItem("userPermission", userPermission);
    }
  }

  secretKey = 'IPGCOURSERAMZEYRASHAD';

  encryptAndStore(key: string) {
    const encryptedKey = CryptoJS.AES.encrypt(key, this.secretKey).toString();
    localStorage.setItem('twoStepAuthKey', encryptedKey);
  }

  private handleAuthenticationTwoStep(userData: any) {

    if (userData.result.authenticatedUser.userStatusId == 2) {
      showInfoAlert("Info", "Hesabınız təsdiqləndikdən sonra sistemə giriş edə bilərsiniz", true, false, '', 'Close')
      this.router.navigate(["/auth/login"]);
      return
    } else {
      this.router.navigate(["/main-teacher-management/main-home"])
      setTimeout(() => {
        location.reload()
      }, 200);
    }

    const user = User.createUserInstance(userData.result);
    const userPermission = userData.result.permissions;
    this.user.next(user);
    this.localStorageService.setItem("user", user);
    this.localStorageService.setItem("userPermission", userPermission);
  }

  private createAuthorizationHeader(token?: string): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    });
  }
  getProfileImage() {
    return this.http.get(
      `${this.baseUrl}users/profile/image`, {
      responseType: 'blob',
    })

  }
}
