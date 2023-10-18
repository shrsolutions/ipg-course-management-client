import { Injectable } from "@angular/core";
import Swal from "../../../assets/libs/sweetalert2/sweetalert2.min.js";

@Injectable({
  providedIn: "root",
})
export class SweatAlertService {
  constructor() {}

  confirmDialog(
    title: string = "Are you sure?",
    text: string = "You won't be able to revert this!",
    confirmButtonText: string = "Yes, delete it!"
  ) {
    return Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
  }
}
