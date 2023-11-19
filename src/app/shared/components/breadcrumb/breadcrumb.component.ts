import { AfterViewInit, Component, OnInit } from "@angular/core";
import { BreadcrumbService } from "../../services/breadcrumb.service";

@Component({
  selector: "app-breadcrumb",
  template: `
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li
          *ngFor="let breadcrumb of breadcrumbs; let last = last"
          class="breadcrumb-item"
        >
          <ng-container *ngIf="!last; else lastItem">
            <a [routerLink]="breadcrumb.url" style="cursor: pointer;">
              {{ breadcrumb.label }}
            </a>
          </ng-container>
          <ng-template #lastItem>
            {{ breadcrumb.label }}
          </ng-template>
        </li>
      </ol>
    </nav>
  `,
  styleUrls: ["./breadcrumb.component.scss"],
})
export class BreadcrumbComponent implements AfterViewInit {
  breadcrumbs = [];

  constructor(private breadcrumbService: BreadcrumbService) {}
  ngAfterViewInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe((data) => {
      console.log(data);
      this.breadcrumbs = data;
    });
  }
}
