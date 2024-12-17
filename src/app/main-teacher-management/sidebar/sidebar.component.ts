import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { AuthService } from "src/app/user-auth/auth.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService
  ) {}
  permission:any
  ngOnInit(): void {
     const storedPermissions = localStorage.getItem('userPermission');
     if (storedPermissions) {
       try {
         this.permission= JSON.parse(storedPermissions);
       } catch (e) {
         console.error('Error parsing permissions:', e);
         this.permission= [];
       }
     }
   }
}
