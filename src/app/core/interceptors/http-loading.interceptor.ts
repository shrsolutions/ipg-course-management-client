import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, finalize } from "rxjs";
import { LoadingService } from "src/app/shared/services/loading.service";

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}
  private totalRequests = 0;
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loadingService.showSpinner(); // Display loading spinner

    return next.handle(request).pipe(
      finalize(() => {
        if (this.totalRequests == 0) {
          this.loadingService.hideSpinner();
        }
      })
    );
  }
}
