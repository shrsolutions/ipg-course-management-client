import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

interface Subjects {
  Id: number;
  SubjectName: string;
}
const SUBJEC_MOCKS: Subjects[] = [
  {
    Id: 1,
    SubjectName: "Kimya",
  },
  {
    Id: 2,
    SubjectName: "Fizika",
  },
  {
    Id: 3,
    SubjectName: "Riyaziyyat",
  },
  {
    Id: 4,
    SubjectName: "Tarix",
  },
];
@Component({
  selector: "app-subject",
  templateUrl: "./subject.component.html",
  styleUrls: ["./subject.component.scss"],
})
export class SubjectComponent {
  displayedColumns: string[] = ["Id", "SubjectName", "Edit"];
  dataSource: MatTableDataSource<Subjects>;
  onRowClick() {

    console.log("Clicked row");
  }
  constructor() {
    this.dataSource = new MatTableDataSource(SUBJEC_MOCKS);
  }
}
