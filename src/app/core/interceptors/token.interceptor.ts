import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const user = this.localStorageService.getItem<any>("user");
    
    console.log(user);
    if (user) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user._token}`,
        },
      });
    }

    return next.handle(request);
  }
}
