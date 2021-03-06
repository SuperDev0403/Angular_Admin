import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { BoardfyService } from '../../../services/boardfy/boardfy.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { User } from '../../../interfaces/user';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AngularCsv } from 'angular7-csv';
import { ChartType } from '../pos.model';
import { TranslateService } from '@ngx-translate/core';
import { formatMoney } from '../../../currencyformat';

@Component({
  selector: 'app-po-rejection',
  templateUrl: './po-rejection.component.html',
  styleUrls: ['./po-rejection.component.scss']
})
export class PoRejectionComponent implements OnInit {

  breadCrumbItems: Array<{}>;

  revenueAreaChart: ChartType;

  user: User;
  role = '';

  vendor_codes = [];
  selected_vendor_code_sale = '0';
  selected_vendor_code_product = '0';
  loadingVendorcodes = false;

  total_lost_cost = 0;
  total_lost_percent = 0;

  tomonth;
  frommonth;

  lineChartLabels_mon = [1];

  months_cost = [];
  months_label = [];
  total_figure = 0;
  chartLoading = false;

  tomonth_topten;
  frommonth_topten;
  ProductListingData = [];
  ProductListingData_origin = [];
  loadingProductListing = false;

  title: string;

  constructor(private authService: AuthService, private router: Router, private boardfyService: BoardfyService, private calendar: NgbCalendar, private translate: TranslateService) { }

  ngOnInit() {
    this.translate.get('menu.po_rejection').subscribe((text:string) => { 
      this.title = text; 
      this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/', active: true }];
    });
    
    this.user = this.authService.getUser();
    this.role = this.user.role;
    if (this.role == 'client') {
      this.selected_vendor_code_sale = '0';
      this.selected_vendor_code_product = '0';

      this.tomonth = this.calendar.getToday();
      this.frommonth = {year: this.tomonth.year - 1, month: this.tomonth.month, day: 1};
      this.tomonth_topten = this.calendar.getToday();
      this.frommonth_topten = {year: this.tomonth_topten.year - 1, month: this.tomonth_topten.month, day: 1};

      this.getVendorcode();
      
    } else {
      this.router.navigate(['/users']);
    }
  }

  getFeaturebyVendorcode() {
    this.getMonthlyInvoiceLoss();
    this.getMostInvoiceLostProducts();
  }

  getVendorcode() {
    this.loadingVendorcodes = true;
    this.boardfyService.getVendorCodes(this.user.id).subscribe((res: any) => {
      let codes_arr = res.result;
      for (let i = 0; i < codes_arr.length; i++) {
        this.vendor_codes.push(codes_arr[i].vendor_code_code);
      }
      this.getFeaturebyVendorcode();
      this.loadingVendorcodes = false;
    });
  }

  filterSalesbyCode(vendor_code: any) {
    this.selected_vendor_code_sale = vendor_code;
    this.chartLoading = true;
    this.getFigure();
    this.chartLoading = false;
  }

  filterProductbyCode(vendor_code: any) {
    this.selected_vendor_code_product = vendor_code;
    this.getMostInvoiceLostProducts();
  }

  getFigure() {
    this.total_figure = 0;
    let lineChartDatasets = [];
    if (this.selected_vendor_code_sale == '0')
    {
      for (let item in this.months_cost)
      {
        this.total_figure += this.months_cost[item][1];

        lineChartDatasets.push({
          label: this.months_cost[item][0],
          backgroundColor: 'rgba(26, 128, 156, 0.3)',
          borderColor: '#1abc9c',
          data: this.months_cost[item][2]
        });
      }
    } else {
      for (let item in this.months_cost)
      {
        if (this.months_cost[item][0] == this.selected_vendor_code_sale)
        {
          this.total_figure = this.months_cost[item][1];
          lineChartDatasets.push({
            label: this.months_cost[item][0],
            backgroundColor: 'rgba(26, 128, 156, 0.3)',
            borderColor: '#1abc9c',
            data: this.months_cost[item][2]
          });
          break;
        }
      }
    }
    var revenueAreaChartdata: ChartType = {
      labels: this.months_label,
      datasets: lineChartDatasets,
      options: {
          maintainAspectRatio: false,
          responsive: true,
          legend: {
              display: false
          },
          tooltips: {
              intersect: false
          },
          hover: {
              intersect: true
          },
          plugins: {
              filler: {
                  propagate: false
              }
          },
          scales: {
              xAxes: [{
                  reverse: true,
                  gridLines: {
                      color: 'rgba(0,0,0,0.05)'
                  }
              }],
              yAxes: [{
                  display: true,
                  borderDash: [5, 5],
                  gridLines: {
                      color: 'rgba(0,0,0,0)',
                      fontColor: '#fff'
                  },
                  ticks: {
                    beginAtZero: true,
                    callback: function(value, index, values) {
                      return formatMoney(value) + '\u20AC';
                    }
                  }
              }]
          }
      }
    };
    
    this.revenueAreaChart = revenueAreaChartdata;
  }

  getMoneyStr(val) {
    return formatMoney(val);
  }

  getKeyRejFigures() {
    this.boardfyService.getKeyRejFigures(this.user.id, this.selected_vendor_code_sale).subscribe((res: any) => {
      console.log(res.result);
      this.total_lost_cost = res.result.total_lost_cost;
      this.total_lost_percent = res.result.total_lost_percent;
    });
  }

  onGetMonthlyInvoiceLoss() {
    this.getMonthlyInvoiceLoss();
  }

  getMonthlyInvoiceLoss() {
    this.lineChartLabels_mon = [];
    this.months_cost = [];
    this.months_label = [];
    this.chartLoading = true;

    this.boardfyService.getMonthlyInvoiceLoss(this.user.id, this.selected_vendor_code_sale, this.datetostr(this.frommonth), this.datetostr(this.tomonth)).subscribe((res: any) => {
      let result = res.result;

      let labels = this.dateRange(this.frommonth.year, this.tomonth.year, this.frommonth.month, this.tomonth.month);
      this.months_label = labels;

      for (let code in this.vendor_codes)
      {
        let arr = new Array(labels.length).fill(0);
        let sum = 0;
        for (let item in result)
        {
          if (result[item].ven_code == this.vendor_codes[code])
          {
            let yr_mon = result[item].yr + '-' + (result[item].mon > 9 ? result[item].mon : '0' + result[item].mon);
            var idx = labels.indexOf(yr_mon);
            arr[idx] = result[item].total_cost;
            sum += parseFloat(arr[idx]);
          }
        }
        
        this.months_cost.push([this.vendor_codes[code], sum, arr]);
      }
      
      this.getFigure();

      this.chartLoading = false;
    })
  }
  datetostr(date) {
    let month1 = (date.month < 10) ? '0' + date.month : date.month;
    let day1 = (date.day < 10) ? '0' + date.day : date.day;
    let strdate = date.year + '-' + month1 + '-' + day1;
    return strdate;
  }

  onGetMostInvoiceLostProducts() {
    this.getMostInvoiceLostProducts();
  }

  getMostInvoiceLostProducts() {
    this.ProductListingData = [];
    this.loadingProductListing = true;
    this.boardfyService.getMostInvoiceLostProducts(this.user.id, this.selected_vendor_code_product, this.datetostr(this.frommonth_topten), this.datetostr(this.tomonth_topten)).subscribe((res: any) => {
      let result = res.result;
      
      this.ProductListingData_origin = res.result;
      let total_cost = 0;
      for (let i = 0; i < this.ProductListingData_origin.length; i++) {
        total_cost += parseFloat(this.ProductListingData_origin[i].total_cost);
      }
      
      for (let i = 0; i < this.ProductListingData_origin.length; i++) {
        this.ProductListingData_origin[i].average_cost = (this.ProductListingData_origin[i].total_cost / this.ProductListingData_origin[i].total_count).toFixed(2);
        this.ProductListingData_origin[i].percent = (this.ProductListingData_origin[i].total_cost / total_cost * 100).toFixed(0) + '%';
        if ( i < 10)        
          this.ProductListingData.push(this.ProductListingData_origin[i]);
      }
      this.loadingProductListing = false;
    });
  }

  exportCSV() {
    let filename = 'invoicelost_products_' + this.datetostr(this.frommonth_topten) + '_' + this.datetostr(this.tomonth_topten);

    let sname = '';
    this.translate.get('main.name').subscribe((text:string) => { sname = text; });
    let unit_rejected = '';
    this.translate.get('main.unit_rejected').subscribe((text:string) => { unit_rejected = text; });
    let total_rejected_cost = '';
    this.translate.get('main.total_rejected_cost').subscribe((text:string) => { total_rejected_cost = text; });
    let average_rejected_cost = '';
    this.translate.get('main.average_rejected_cost').subscribe((text:string) => { average_rejected_cost = text; });
    let percentage_against_total_rejected_cost = '';
    this.translate.get('main.percentage_against_total_rejected_cost').subscribe((text:string) => { 

      var options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true, 
        showTitle: false,
        title: '',
        useBom: true,
        noDownload: false,
        headers: ["Asin", sname, unit_rejected, total_rejected_cost, average_rejected_cost, percentage_against_total_rejected_cost + " %"]
      };
  
      new AngularCsv(this.ProductListingData_origin, filename, options);
    })
  }

  dateRange(startYear, endYear, _startMon, _endMonth) {
    let dates = [];
    for(var i = startYear; i <= endYear; i++) {
      var endMonth = i != endYear ? 11 : _endMonth - 1;
      var startMon = i === startYear ? _startMon-1 : 0;
      for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
        var month = j+1;
        var displayMonth = month < 10 ? '0'+month : month;
        dates.push([i, displayMonth].join('-'));
      }
    }
    return dates;
  }
}
