import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Table } from './seller-product-listing.model';

import { AdvancedService } from './seller-product-listing.service';
import { AdvancedSortableDirective, SortEvent } from '../sortable.directive';

import { AuthService } from '../../../services/auth/auth.service';
import { BoardfyService } from '../../../services/boardfy/boardfy.service';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { User } from '../../../interfaces/user';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AngularCsv } from 'angular7-csv';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-seller-product-listing',
  templateUrl: './seller-product-listing.component.html',
  styleUrls: ['./seller-product-listing.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class SellerProductListingComponent implements OnInit {

  datePicker: NgbDateStruct;
  user: User;
  role = '';
  SellerProductListingData = [];
  SellerProductListingData_origin = [];
  loadingSellerProductListing = false;
  date;
  seller_id;
  seller_name;

  // bread crum data
  breadCrumbItems: Array<{}>;

  // Table data
  tableData: Table[];

  tables$: Observable<Table[]>;
  total$: Observable<number>;

  title: string;

  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;
  
  constructor(public service: AdvancedService, private authService: AuthService, private router: Router, private boardfyService: BoardfyService, private calendar: NgbCalendar, private route: ActivatedRoute, private translate: TranslateService) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    this.translate.get('menu.price_monitoring').subscribe((text:string) => { 
      this.title = text; 
      this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/' }, { label: '', path: '/', active: true }];
    });
    this.translate.get('menu.seller_product_listing').subscribe((text:string) => { 
      this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/' }, { label: text, path: '/', active: true }];
    });

    this.seller_id = this.route.snapshot.paramMap.get("seller_id");
    this.seller_name = this.route.snapshot.paramMap.get("seller_name");
    this.user = this.authService.getUser();
    this.role = this.user.role;
    if (this.user.mc && this.role == 'client') {
      this.date = this.calendar.getToday();
      this.getSellerProductListing();
    } else {
      this.router.navigate(['/users']);
    }
  }

  getSellerProductListing() {
    let month1 = (this.date.month < 10) ? '0' + this.date.month : this.date.month;
    let day1 = (this.date.day < 10) ? '0' + this.date.day : this.date.day;
    let date = this.date.year + '-' + month1 + '-' + day1;
    this.loadingSellerProductListing = true;
    this.boardfyService.getSellerProductListing(this.user.mc, date, this.seller_id).subscribe((res: any) => {
      this.SellerProductListingData = res.result;
      this.SellerProductListingData.sort(function (a, b) { return (b.rrp - b.price) - (a.rrp - a.price) });
      for (let i = 0; i < this.SellerProductListingData.length; i++) {
        this.SellerProductListingData[i].price = parseFloat(this.SellerProductListingData[i].price).toFixed(2);
        this.SellerProductListingData[i].rrp = parseFloat(this.SellerProductListingData[i].rrp).toFixed(2);
        this.SellerProductListingData[i].diff = this.SellerProductListingData[i].price - this.SellerProductListingData[i].rrp;
        this.SellerProductListingData[i].perdiff = (this.SellerProductListingData[i].diff / this.SellerProductListingData[i].rrp * 100).toFixed(0);
      }
      this.SellerProductListingData_origin = this.SellerProductListingData;
      this.service.tableData = this.SellerProductListingData;
      this.loadingSellerProductListing = false;
    })
  }

  exportCSV() {
    let month1 = (this.date.month < 10) ? '0' + this.date.month : this.date.month;
    let day1 = (this.date.day < 10) ? '0' + this.date.day : this.date.day;
    let date = this.date.year + '-' + month1 + '-' + day1;
    let filename = 'seller-product-listing_' + date;

    var exportData = [];
    for (let i = 0; i < this.SellerProductListingData.length; i++) {
      exportData.push({ ean: this.SellerProductListingData[i].ean, name: this.SellerProductListingData[i].productName, rrp: this.SellerProductListingData[i].rrp, price: this.SellerProductListingData[i].price, diff: this.SellerProductListingData[i].diff, perdiff: this.SellerProductListingData[i].perdiff + "%" });
    }

    let sname = '';
    this.translate.get('main.name').subscribe((text:string) => { sname = text; });
    let rrp = '';
    this.translate.get('main.rrp').subscribe((text:string) => { rrp = text; });
    let price = '';
    this.translate.get('main.price').subscribe((text:string) => { price = text; });
    let difference = '';
    this.translate.get('main.difference').subscribe((text:string) => { 
      difference = text; 
      var options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true, 
        showTitle: false,
        title: '',
        useBom: true,
        noDownload: false,
        headers: ["EAN", sname, rrp, price, difference, difference + " %"]
      };
  
      new AngularCsv(exportData, filename, options);
    });
  }

    /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
