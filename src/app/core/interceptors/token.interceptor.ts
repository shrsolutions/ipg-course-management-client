import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from "rxjs";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/user-auth/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private authService: AuthService,
  ) { }
  private excludeSpinnerUrls: string[] = ['send-confirm-code', 'verify', 'resend-confirm-code', 'register'];
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.localStorageService.getItem<any>("user");

    // bu endpointlərdə Authorization header əlavə olunmayacaq
    const excludeSpinner = this.excludeSpinnerUrls.some(url => request.url.includes(url));

    if (!excludeSpinner && user && user._token) {
      request = this.addTokenHeader(request, user._token);
    }
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401 && user && user._refreshToken && !excludeSpinner) {
          return this.handle401Error(request, next, user._refreshToken);
        }

        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler, refreshToken: string) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshTokenApi({ activeRefreshToken: refreshToken }).pipe(
        switchMap((res: any) => {
          const newUser = {
            ...this.localStorageService.getItem<any>("user"),
            _token: res.result.newToken,
            _refreshToken: res.result.newRefreshToken
          };
          this.localStorageService.setItem("user", newUser);

          this.refreshTokenSubject.next(res.result.newToken);
          return next.handle(this.addTokenHeader(request, res.result.newToken));
        }),
        catchError(err => {
          if (err.status === 401 || err.status === 403) {
            this.localStorageService.removeItem("user");
            this.localStorageService.removeItem("userPermission");
            this.router.navigate(["/auth/login"]);
          }
          this.refreshTokenSubject.error(err);
          return throwError(() => err);
        }),
        finalize(() => this.isRefreshing = false)
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => next.handle(this.addTokenHeader(request, token!)))
      );
    }
  }

}