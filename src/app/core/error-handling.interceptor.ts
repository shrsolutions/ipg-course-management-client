import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { NotificationService } from "../shared/services/notification.service";

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unknown error occurred";
        let userErrorMessage = "";

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Error ${error.status}: ${error.error.message}`;

          const serverErrorMessages = error.error.messages || [];

          switch (error.status) {
            case 400:
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
              break;
            case 404:
              userErrorMessage = "System error";
              break;

            // Add more cases for handling other status codes if needed

            default:
              break;
          }
        }

        if (userErrorMessage) {
          this.notificationService.showError(userErrorMessage);
        }

        // Rethrow the error to be caught by the calling component or service.
        return throwError(() => errorMessage);
      })
    );
  }
}
