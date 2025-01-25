import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private requestCount = 0;

  constructor(private spinner: NgxSpinnerService) { }

  public showSpinner() {
    if (this.requestCount === 0) {
      this.spinner.show();
    }
    this.requestCount++;
  }

  public hideSpinner() {
    this.requestCount--;
    if (this.requestCount === 0) {
      this.spinner.hide();
    }
  }
}
