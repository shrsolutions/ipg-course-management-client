import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./user-auth/user-auth.module").then((m) => m.UserAuthModule),
  },
  {
    path: "main-teacher-management",
    loadChildren: () =>
      import("./main-teacher-management/main-teacher-management.module").then(
        (m) => m.MainTeacherManagementModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
