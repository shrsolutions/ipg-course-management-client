import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/services/admin.service';
import { PaginatorModel } from '../../models/Base/FetchBaseModel';
import { showConfirmAlert, showErrorAlert, showInfoAlert } from 'src/app/shared/helper/alert';
import { NewAdComponent } from './new-ad/new-ad.component';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {

constructor(
    private adminService: AdminService,
    public openMatDialog: MatDialog,
  ) { }

  pageSize = 10;
  currentPage = 1;
  length!: number
  displayedColumns: string[] = [
    "ad",
    "edit",
    "remove",
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  paginatorModel: PaginatorModel = {
    count: this.pageSize,
    page: this.currentPage,
  };

  filters = {
    page: this.currentPage,
    count: this.pageSize,
    exactFilters: [],
  };
  nameFilter: string = '';
  surnameFilter: string = '';

  ngOnInit() {
    this.getAllAds()
  }


  getAllAds() {
    this.adminService.getAllAds(this.filters).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<any>(res.result.data);
      this.length = res.result.count
    });
  }

  getAdImage(adId: string, imageId: string) {
    return this.adminService.getAdImagebyAdID(adId, imageId)
  }

  applyFilters() {
    // ExactFilters
    this.filters.exactFilters = [];
    if (this.nameFilter) {
      this.filters.exactFilters.push({
        propertyName: 'name',
        value: this.nameFilter
      });
    }
    if (this.surnameFilter) {
      this.filters.exactFilters.push({
        propertyName: 'surname',
        value: this.surnameFilter
      });
    }

    this.getAllAds(); // API sorğusunu göndər
  }

  onPageChanged(event: PageEvent) {
    this.filters.page = event.pageIndex + 1;
    this.filters.count = event.pageSize;
    this.getAllAds()
  }

  removeAd(id: string) {
    showConfirmAlert('Delete selected row?', '', 'Delete', `Close`).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteAd(id).subscribe({
          next: (res: any) => {
            showInfoAlert('', res.messages, false, true, 'Close')
            this.getAllAds()
          },
          error: err => {
            showErrorAlert('Error', err.message, 'Close')
          }
        })
      }
    })
  }

  openDialog(ad: any[] = null) {
    let dialogRef = this.openMatDialog.open(NewAdComponent, {
      maxHeight: "95vh",
      width: "40%",
      data: ad ,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllAds();
    });
  }

}
