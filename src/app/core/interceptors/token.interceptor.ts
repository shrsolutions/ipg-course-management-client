import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }
  private excludeSpinnerUrls: string[] = ['send-confirm-code', 'verify', 'resend-confirm-code'];
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const user = this.localStorageService.getItem<any>("user");
    const excludeSpinner = this.excludeSpinnerUrls.some(url => request.url.includes(url));
    if (!excludeSpinner) {
      if (user && user._token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${user._token}`,
          },
        });
      }
      else {
        this.localStorageService.removeItem("user");
        this.localStorageService.removeItem("userPermission");

        this.router.navigate(["/auth/login"]);
      }
    }

    return next.handle(request);
  }
}
