import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BoardfyService } from '../../services/boardfy/boardfy.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { month_label } from './data';
import { Widget, Inbox, Chat, Todo, ChartType } from './home.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { formatMoney } from '../../currencyformat';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  revenueAreaChart: ChartType;
  revenueRadialChart: ChartType;
  vendorRadialChart: ChartType;
  projectionBarChart: ChartType;

  widget: Widget[];

  //.
  user: User;
  role = '';

  loading_sales = false;
  lineChartData_mon = [];
  this_month_cost = 0;
  last_month_cost = 0;
  last_year_cost = 0;
  last_month_cost_perc = '';
  last_year_cost_perc = '';

  this_month_unit = 0;
  last_month_unit = 0;
  last_month_unit_perc = '';

  lineChartLabels_yr = [];
  this_year_sales_cost = 0;
  last_year_sales_cost = 0;
  last_year_sales_cost_perc = '';

  this_year_sales_unit = 0;
  last_year_sales_unit = 0;
  last_year_sales_unit_perc = '';

  loading_products = false;
  products = [];
  available = [];
  platform = '';
  country = '';

  loading_sellers = false;
  sellers = [];
  below_vendor_count = 0

  loading_bar = false;

  
  constructor(private router: Router, public formBuilder: FormBuilder, private authService: AuthService, private boardfyService: BoardfyService, private translate: TranslateService) { 
    
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: 'Dashboard', path: '/', active: true }];

    this.user = this.authService.getUser();
    this.role = this.user.role;
    if (this.role == 'client') {
      this.widget = [];

      this.getDatesales();
      if (this.user.mc) {
        this.getProducts();
        this.getSellers();
      }
    } else {
      this.router.navigate(['/users']);
    }
  }

  getSellers() {
    this.loading_sellers = true;
    let date = new Date();
    let y = date.getFullYear();
    let month = date.getMonth() + 1;
    let m = (month < 10) ? '0' + month : month;
    let d = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    let date_ymd = y + '-' + m + '-' + d;
    this.boardfyService.getSellerPricingStats(this.user.mc, date_ymd).subscribe((res: any) => {
      this.sellers = res.result;
      console.log(res.result);
      
      if (this.sellers[0].belowCount)
        this.below_vendor_count = this.sellers[0].belowCount;
      else
        this.below_vendor_count = 0;
      
      // this.pieChartLabels_sellers = ['PVR', 'Abajo PVR'];
      // this.pieChartData_sellers = [this.sellers[0].totalvendors - this.sellers[0].belowCount, this.sellers[0].belowCount];
      let series = [];
      if (this.sellers[0].totalvendors > 0) {
        series.push(((this.sellers[0].totalvendors - this.below_vendor_count) / this.sellers[0].totalvendors * 100 + 0.5)^0)
      } else {
        series.push(0);
      }
      let vendorRadialChart: ChartType = {
        chart: {
            height: 200,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '65%',
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        fontSize: '24px',
                        color: 'rgb(61, 187, 0)',
                        offsetY: 10,
                        formatter: (val) => {
                            return val + '%';
                        }
                    }
                }
            }
        },
        colors: ['rgb(61, 187, 0)'],
        series: series,
        stroke: {
            lineCap: 'round',
        },
      };
      this.vendorRadialChart = vendorRadialChart;

      this.loading_sellers = false;
    })
    this.loading_bar = true;
    this.boardfyService.getAllProductsAndSellersStats(this.user.mc, date_ymd).subscribe((res: any) => {
      let products = res.result;

      let label1 = '';
      this.translate.get('main.vendor_rrp_pricing').subscribe((text:string) => { label1 = text; });

      let projectionBarChart: ChartType = {
        labels: ['<-15%', '-15%', '-10%', 'PVR', '10%', '25%', '50%', '50%>'],
        datasets: [
            {
                label: label1,
                backgroundColor: '#1abc9c',
                borderColor: '#1abc9c',
                hoverBackgroundColor: '#1abc9c',
                hoverBorderColor: '#1abc9c',
                data: [products[0].a1, products[0].a2, products[0].a3, products[0].a4, products[0].a5, products[0].a6, products[0].a7, products[0].a8]
            }
        ],
        options: {
            maintainAspectRatio: false,
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    stacked: false,
                    ticks: {
                      beginAtZero: true
                    }
                }],
                xAxes: [{
                    barPercentage: 0.7,
                    categoryPercentage: 0.5,
                    stacked: false,
                    gridLines: {
                        color: 'rgba(0,0,0,0.01)'
                    }
                }]
            }
        }
      };
      this.projectionBarChart = projectionBarChart;

      this.loading_bar = false;
    })
  }

  getProducts() {
    this.loading_products = true;
    let date = new Date();
    let y = date.getFullYear();
    let month = date.getMonth() + 1;
    let m = (month < 10) ? '0' + month : month;
    let d = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    let date_ymd = y + '-' + m + '-' + d;
    this.boardfyService.getProductListingStats(this.user.mc, date_ymd).subscribe((res: any) => {
      this.products = res.result;
      this.available = this.products.filter(v => v.available == true)
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].country && this.products[i].platform) {
          this.platform = this.products[i].platform;
          this.country = this.products[i].country;
          break;
        }
      }

      let series = [];
      if (this.products.length > 0) {
        series.push((this.available.length / this.products.length * 100 + 0.5)^0)
      } else {
        series.push(0);
      }
      let revenueRadialChart: ChartType = {
        chart: {
            height: 200,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '65%',
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        fontSize: '24px',
                        color: 'rgb(61, 187, 0)',
                        offsetY: 10,
                        formatter: (val) => {
                            return val + '%';
                        }
                    }
                }
            }
        },
        colors: ['rgb(61, 187, 0)'],
        series: series,
        stroke: {
            lineCap: 'round',
        },
      };
      this.revenueRadialChart = revenueRadialChart;
      this.loading_products = false;
    })
  }

  getDatesales() {
    let date = new Date();
    let y = date.getFullYear();
    let month = date.getMonth() + 1;
    let m = (month < 10) ? '0' + month : month;
    let d = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    let date_ymd = y + '-' + m + '-' + d;
    this.loading_sales = true;
    this.boardfyService.getDatesales(this.user.id, date_ymd).subscribe((res: any) => {
      let result = res.result;
      
      if (result.this_month[0].total_cost)
        this.this_month_cost = parseFloat(result.this_month[0].total_cost);
      if (result.last_month[0].total_cost)
        this.last_month_cost = parseFloat(result.last_month[0].total_cost);
      if (result.last_year[0].total_cost)
        this.last_year_cost = parseFloat(result.last_year[0].total_cost);
      
      let last_month_cost_positive = true;
      if (this.last_month_cost > 0) {
        let perc = this.this_month_cost / this.last_month_cost * 100 - 100;
        if (perc >= 0) {
          this.last_month_cost_perc = '+' + perc.toFixed(2) + '%';
        } else {
          this.last_month_cost_perc = perc.toFixed(2) + '%';
          last_month_cost_positive = false;
        }
      }
      
      if (this.last_year_cost > 0) {
        let perc = this.this_month_cost / this.last_year_cost * 100 - 100;
        if (perc >= 0) {
          this.last_year_cost_perc = '+' + perc.toFixed(2) + '%';
        } else {
          this.last_year_cost_perc = perc.toFixed(2) + '%';
        }
      }
      
      let label0 = '';
      this.translate.get('main.month_to_date_sales').subscribe((text:string) => { label0 = text; });
      let label1 = '';
      this.translate.get('main.previous_thirty_days').subscribe((text:string) => { label1 = text; });

      this.widget.push({
        title: label0,
        value: formatMoney(this.this_month_cost) + '\u20AC',
        text: label1 + ': ' + formatMoney(this.last_month_cost) + '\u20AC',
        positive: last_month_cost_positive,
        revenue: this.last_month_cost_perc
      });
      
      //unit
      if (result.this_month[0].total_count)
        this.this_month_unit = parseInt(result.this_month[0].total_count);
      if (result.last_month[0].total_count)
        this.last_month_unit = parseInt(result.last_month[0].total_count);

      let last_month_unit_positive = true;
      if (this.last_month_unit > 0) {
        let perc = this.this_month_unit / this.last_month_unit * 100 - 100;
        if (perc >= 0) {
          this.last_month_unit_perc = '+' + perc.toFixed(2) + '%';
        } else {
          this.last_month_unit_perc = perc.toFixed(2) + '%';
          last_month_unit_positive = false;
        }
      }
      let label01 = '';
      this.translate.get('main.month_to_date_units').subscribe((text:string) => { label01 = text; });

      
      var range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);
      this.lineChartLabels_yr = range(1, 12 + 1);
      var lineChartDatasets = [];
      
      let this_yr_arr = new Array(this.lineChartLabels_yr.length).fill(0);
      for (let i = 0; i < this.lineChartLabels_yr.length; i++) {
        for (let j = 0; j < result.this_year_sales.length; j++) {
          if (result.this_year_sales[j].month == this.lineChartLabels_yr[i]) {
            this_yr_arr[i] = result.this_year_sales[j].total_cost;
            break;
          }
        }
      }
      for (let j = 0; j < result.this_year_sales.length; j++) {
        let cost = parseFloat(result.this_year_sales[j].total_cost);
        this.this_year_sales_cost += cost;
      }
      
      let label2 = '';
      this.translate.get('main.this_year').subscribe((text:string) => { label2 = text; });
      // if (this.this_year_sales_cost > 0)
      lineChartDatasets.push({
        label: label2,
        backgroundColor: 'rgba(26, 128, 156, 0.3)',
        borderColor: '#1abc9c',
        data: this_yr_arr
      });


      let last_yr_arr = new Array(this.lineChartLabels_yr.length).fill(0);
      for (let i = 0; i < this.lineChartLabels_yr.length; i++) {
        for (let j = 0; j < result.last_year_sales.length; j++) {
          if (result.last_year_sales[j].month == this.lineChartLabels_yr[i]) {
            last_yr_arr[i] = result.last_year_sales[j].total_cost;
            break;
          }
        }
      }
      
      for (let j = 0; j < result.last_year_sales.length; j++) {
        if (result.last_year_sales[j].month <= date.getMonth() + 1){
          let cost = parseFloat(result.last_year_sales[j].total_cost);
          this.last_year_sales_cost += cost;
        }
      }

      let last_year_positive = true;
      if (this.last_year_sales_cost > 0) {
        let perc = this.this_year_sales_cost / this.last_year_sales_cost * 100 - 100;
        if (perc >= 0) {
          this.last_year_sales_cost_perc = '+' + perc.toFixed(2) + '%';
        } else {
          this.last_year_sales_cost_perc = perc.toFixed(2) + '%';
          last_year_positive = false;
        }
      }
      
      let label3 = '';
      this.translate.get('main.last_year').subscribe((text:string) => { label3 = text; });
      lineChartDatasets.push({
        label: label3,
        fill: true,
        backgroundColor: 'transparent',
        borderColor: '#f1556c',
        borderDash: [5, 5],
        data: last_yr_arr          
      });

      let label4 = '';
      this.translate.get('main.year_to_date_sales').subscribe((text:string) => { label4 = text; });
      let label5 = '';
      this.translate.get('main.last_year').subscribe((text:string) => { label5 = text; });
      this.widget.push({
        title: label4,
        value: formatMoney(this.this_year_sales_cost) + '\u20AC',
        text: label5 + ': ' + formatMoney(this.last_year_sales_cost) + '\u20AC',
        positive: last_year_positive,
        revenue: this.last_year_sales_cost_perc
      });
      
      //unit
      let label41 = '';
      this.translate.get('main.year_to_date_units').subscribe((text:string) => { label41 = text; });

      for (let j = 0; j < result.this_year_sales.length; j++) {
        let unit = parseInt(result.this_year_sales[j].total_count);
        this.this_year_sales_unit += unit;
      }

      for (let j = 0; j < result.last_year_sales.length; j++) {
        if (result.last_year_sales[j].month <= date.getMonth() + 1){
          let unit = parseFloat(result.last_year_sales[j].total_count);
          this.last_year_sales_unit += unit;
        }
      }

      let last_year_unit_positive = true;
      if (this.last_year_sales_unit > 0) {
        let perc = this.this_year_sales_unit / this.last_year_sales_unit * 100 - 100;
        if (perc >= 0) {
          this.last_year_sales_unit_perc = '+' + perc.toFixed(2) + '%';
        } else {
          this.last_year_sales_unit_perc = perc.toFixed(2) + '%';
          last_year_unit_positive = false;
        }
      }

      this.widget.push({
        title: label01,
        value: this.this_month_unit.toString(),
        text: label1 + ': ' + this.last_month_unit,
        positive: last_month_unit_positive,
        revenue: this.last_month_unit_perc
      });
      this.widget.push({
        title: label41,
        value: this.this_year_sales_unit.toString(),
        text: label5 + ': ' + this.last_year_sales_unit,
        positive: last_year_unit_positive,
        revenue: this.last_year_sales_unit_perc
      });

      var revenueAreaChartdata: ChartType = {
        labels: month_label, // .slice(0, date.getMonth() + 1)
        datasets: lineChartDatasets,
        options: {
            maintainAspectRatio: false,
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
      
      this.loading_sales = false;
    })
  }
}
