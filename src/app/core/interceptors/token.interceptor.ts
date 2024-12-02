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
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const user = this.localStorageService.getItem<any>("user");
    
    console.log(user);
    if (user && user._token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user._token}`,
        },
      });
    }
    else{
      this.localStorageService.removeItem("user");

      this.router.navigate(["/auth/login"]);
    }

    return next.handle(request);
  }
}
