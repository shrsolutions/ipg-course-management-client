import { Component } from "@angular/core";
import { LoadingService } from "../shared/services/loading.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent {
  /**
   *
   */
  constructor(public loadingService: LoadingService) {}
}
