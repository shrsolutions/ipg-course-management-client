import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { NotificationService } from "../../shared/services/notification.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = error.message;
        if (error.status==401) {
          this.localStorageService.removeItem("user");
          this.localStorageService.removeItem("userPermission");

          this.router.navigate(["/auth/login"]);
        }
        let userErrorMessage = "";

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Error ${error.status}: ${error.error.message}`;

          const serverErrorMessages = error.error.messages || [];

          switch (error.status) {
            case 400:
              if (serverErrorMessages) {
                for (const message of serverErrorMessages) {
                  switch (message) {
                    case "IncorrectEmailOrPassword":
                      userErrorMessage = "Email or Password is incorrect!";
                      break;
                    case "EmailAlreadyRegistered":
                      userErrorMessage = "Email already registered";
                      break;

                    // Add more cases for specific error messages if needed

                    default:
                      break;
                  }
                }
              }
              break;
            case 404:
              userErrorMessage = "System error";
              break;
            case 500:
              userErrorMessage = "Internal Server Error";
              break;

            default:
              break;
          }
        }

        if (userErrorMessage) {
          this.notificationService.showError(userErrorMessage);
        }

        // Rethrow the error to be caught by the calling component or service.
        return throwError(() => error);
      })
    );
  }
}
