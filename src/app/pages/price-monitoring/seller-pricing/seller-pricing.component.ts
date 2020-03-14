import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Table } from './seller-pricing.model';

import { AdvancedService } from './seller-pricing.service';
import { AdvancedSortableDirective, SortEvent } from '../sortable.directive';

import { AuthService } from '../../../services/auth/auth.service';
import { BoardfyService } from '../../../services/boardfy/boardfy.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { User } from '../../../interfaces/user';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-seller-pricing',
  templateUrl: './seller-pricing.component.html',
  styleUrls: ['./seller-pricing.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class SellerPricingComponent implements OnInit {

  toDatePicker: NgbDateStruct;
  user: User;
  role = '';
  sellerPricingData = [];
  sellerPricingData_origin = [];
  loadingSellerPricing = false;
  date: any;

  // bread crum data
  breadCrumbItems: Array<{}>;

  // Table data
  tableData: Table[];

  tables$: Observable<Table[]>;
  total$: Observable<number>;

  title: string;

  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

  constructor(public service: AdvancedService, private authService: AuthService, private router: Router, private boardfyService: BoardfyService, private calendar: NgbCalendar, private translate: TranslateService) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    this.translate.get('menu.price_monitoring').subscribe((text:string) => { 
      this.title = text; 
      this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/' }, { label: '', path: '/', active: true }];
    });
    this.translate.get('menu.seller_pricing').subscribe((text:string) => { 
      this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/' }, { label: text, path: '/', active: true }];
    });
   
    this.user = this.authService.getUser();
    this.role = this.user.role;
    if (this.user.mc && this.role == 'client') {
      this.date = this.calendar.getToday();
      this.getSellerPricing();
    } else {
      this.router.navigate(['/users']);
    }
    
    /**
     * fetch data
     */
    // this._fetchData();
  }

  getSellerPricing() {
    let month1 = (this.date.month < 10) ? '0' + this.date.month : this.date.month;
    let day1 = (this.date.day < 10) ? '0' + this.date.day : this.date.day;
    let date = this.date.year + '-' + month1 + '-' + day1;
    this.loadingSellerPricing = true;
    this.boardfyService.getSellerPricing(this.user.mc,  date).subscribe((res: any) => {
      this.sellerPricingData = res.result;
      for (let i = 0; i < this.sellerPricingData.length; i++){
        this.sellerPricingData[i].totalProducts = parseInt(this.sellerPricingData[i].totalProducts);
        this.sellerPricingData[i].bellowCount = parseInt(this.sellerPricingData[i].bellowCount);
        this.sellerPricingData[i].bellow_perc = (this.sellerPricingData[i].bellowCount / this.sellerPricingData[i].totalProducts * 100)^0;
      }
      
      this.sellerPricingData.sort(function (a, b) { return b.bellowCount - a.bellowCount });
      this.sellerPricingData_origin = this.sellerPricingData;
      this.service.tableData = this.sellerPricingData;
      this.loadingSellerPricing = false;
    })
  }
  /**
   * fetches the table value
   */
  _fetchData() {
    // this.tableData = tableData;
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: SortEvent) {
    console.log(column);
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
