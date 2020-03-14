import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Table } from './product-listing.model';

import { AdvancedService } from './product-listing.service';
import { AdvancedSortableDirective, SortEvent } from '../sortable.directive';

import { AuthService } from '../../../services/auth/auth.service';
import { BoardfyService } from '../../../services/boardfy/boardfy.service';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { User } from '../../../interfaces/user';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AngularCsv } from 'angular7-csv';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class ProductListingComponent implements OnInit {

  datePicker: NgbDateStruct;
  user: User;
  role = '';
  ProductListingData = [];
  ProductListingData_origin = [];
  loadingProductListing = false;
  date;

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
    this.translate.get('menu.product_listing').subscribe((text:string) => { 
      this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/' }, { label: text, path: '/', active: true }];
    });

    this.user = this.authService.getUser();
    this.role = this.user.role;
    if (this.user.mc && this.role == 'client') {
      this.date = this.calendar.getToday();
      this.getProductListing();
    } else {
      this.router.navigate(['/users']);
    }
  }

  getProductListing() {
    let month1 = (this.date.month < 10) ? '0' + this.date.month : this.date.month;
    let day1 = (this.date.day < 10) ? '0' + this.date.day : this.date.day;
    let date = this.date.year + '-' + month1 + '-' + day1;
    this.loadingProductListing = true;
    this.boardfyService.getProductListing(this.user.mc, date).subscribe((res: any) => {
      this.ProductListingData = res.result;
      console.log(res.result);
      this.ProductListingData.sort(function (a, b) { return (b.rrp - b.price) - (a.rrp - a.price) });
      for (let i = 0; i < this.ProductListingData.length; i++) {
        this.ProductListingData[i].max_price = parseFloat(this.ProductListingData[i].max_price).toFixed(2);
        this.ProductListingData[i].min_price = parseFloat(this.ProductListingData[i].min_price).toFixed(2);
        this.ProductListingData[i].rrp = parseFloat(this.ProductListingData[i].rrp).toFixed(2);
      }
      this.ProductListingData_origin = this.ProductListingData;
      this.service.tableData = this.ProductListingData;
      this.loadingProductListing = false;
    })
  }

  exportCSV() {
    let month1 = (this.date.month < 10) ? '0' + this.date.month : this.date.month;
    let day1 = (this.date.day < 10) ? '0' + this.date.day : this.date.day;
    let date = this.date.year + '-' + month1 + '-' + day1;
    let filename = 'product-listing_' + date;

    var exportData = [];
    for (let i = 0; i < this.ProductListingData.length; i++) {
      let max_diff = (this.ProductListingData[i].max_price - this.ProductListingData[i].rrp).toFixed(2);
      let min_diff = (this.ProductListingData[i].min_price - this.ProductListingData[i].rrp).toFixed(2);
      let max_perdiff = ((this.ProductListingData[i].max_price - this.ProductListingData[i].rrp) / this.ProductListingData[i].rrp * 100).toFixed(2) + '%';
      let min_perdiff = ((this.ProductListingData[i].min_price - this.ProductListingData[i].rrp) / this.ProductListingData[i].rrp * 100).toFixed(2) + '%';
      exportData.push({ ean: this.ProductListingData[i].ean, name: this.ProductListingData[i].productName, rrp: this.ProductListingData[i].rrp,
       max_price: this.ProductListingData[i].max_price, 
       max_diff: max_diff,
       max_perdiff: max_perdiff, 
       min_price: this.ProductListingData[i].min_price, 
       min_diff: min_diff, 
       min_perdiff: min_perdiff
      });
    }

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: '',
      useBom: true,
      noDownload: false,
      headers: ["EAN", "Nombre", "PVR", "Más alto Precio", "Más alto Diferencia", "Más alto Diferencia %", "Más bajo Precio", "Más bajo Diferencia", "Más bajo Diferencia %"]
    };

    new AngularCsv(exportData, filename, options);
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
