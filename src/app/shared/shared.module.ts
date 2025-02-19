import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";

import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { ToggleMenuDirective } from "./directive/toggle-menu.directive";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { RouterModule } from "@angular/router";
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [SpinnerComponent, ToggleMenuDirective, BreadcrumbComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatDatepickerModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ToastrModule.forRoot(),
    RouterModule,
    NgxSpinnerModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    ToastrModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    SpinnerComponent,
    BreadcrumbComponent,
  ],
})
export class SharedModule {}
