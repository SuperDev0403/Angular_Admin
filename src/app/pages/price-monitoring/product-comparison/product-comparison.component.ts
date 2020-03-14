import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Table } from './product-comparison.model';

import { AdvancedService } from './product-comparison.service';
import { AdvancedSortableDirective, SortEvent } from '../sortable.directive';

import { AuthService } from '../../../services/auth/auth.service';
import { BoardfyService } from '../../../services/boardfy/boardfy.service';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { User } from '../../../interfaces/user';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AngularCsv } from 'angular7-csv';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-comparison',
  templateUrl: './product-comparison.component.html',
  styleUrls: ['./product-comparison.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class ProductComparisonComponent implements OnInit {

  datePicker: NgbDateStruct;
  user: User;
  role = '';
  SellerProductComparisonData = [];
  loadingSellerProductComparison = false;
  date;
  ean;
  product_name;
  product_photoUri;

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
    this.translate.get('menu.product_comparison').subscribe((text:string) => { 
      this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/' }, { label: text, path: '/', active: true }];
    });

    this.ean = this.route.snapshot.paramMap.get("ean");
    this.product_name = this.route.snapshot.paramMap.get("product_name");
    this.product_photoUri = this.route.snapshot.paramMap.get("product_photoUri");
    this.user = this.authService.getUser();
    this.role = this.user.role;
    if (this.user.mc && this.role == 'client') {
      this.date = this.calendar.getToday();
      this.getSellerProductComparison();
    } else {
      this.router.navigate(['/users']);
    }
  }

  getSellerProductComparison() {
    let month1 = (this.date.month < 10) ? '0' + this.date.month : this.date.month;
    let day1 = (this.date.day < 10) ? '0' + this.date.day : this.date.day;
    let date = this.date.year + '-' + month1 + '-' + day1;
    this.loadingSellerProductComparison = true;
    this.boardfyService.getSellerProductComparison(this.user.mc, date, this.ean).subscribe((res: any) => {
      this.SellerProductComparisonData = res.result;
      this.SellerProductComparisonData.sort(function (a, b) { return (b.rrp - b.price) - (a.rrp - a.price) });
      for (let i = 0; i < this.SellerProductComparisonData.length; i++) {
        this.SellerProductComparisonData[i].rrp = parseFloat(this.SellerProductComparisonData[i].rrp).toFixed(2);
        this.SellerProductComparisonData[i].price = parseFloat(this.SellerProductComparisonData[i].price).toFixed(2);
        this.SellerProductComparisonData[i].diff = this.SellerProductComparisonData[i].price - this.SellerProductComparisonData[i].rrp;
        this.SellerProductComparisonData[i].perdiff = ((this.SellerProductComparisonData[i].price - this.SellerProductComparisonData[i].rrp) / this.SellerProductComparisonData[i].rrp * 100).toFixed(0);
      }
      this.service.tableData = this.SellerProductComparisonData;
      this.loadingSellerProductComparison = false;
    })
  }

  exportCSV() {
    let month1 = (this.date.month < 10) ? '0' + this.date.month : this.date.month;
    let day1 = (this.date.day < 10) ? '0' + this.date.day : this.date.day;
    let date = this.date.year + '-' + month1 + '-' + day1;
    let filename = 'product-comparison_' + date;

    var exportData = [];
    for (let i = 0; i < this.SellerProductComparisonData.length; i++) {
      exportData.push({ ean: this.ean, name: this.SellerProductComparisonData[i].seller_name, rrp: this.SellerProductComparisonData[i].rrp, price: this.SellerProductComparisonData[i].price, diff: this.SellerProductComparisonData[i].diff, perdiff: this.SellerProductComparisonData[i].perdiff + '%'});
    }

    let seller = '';
    this.translate.get('main.seller').subscribe((text:string) => { seller = text; });
    let pvr = '';
    this.translate.get('main.rrp').subscribe((text:string) => { pvr = text; });
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
        headers: ["EAN", seller, pvr, price, difference, difference + " %"]
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
