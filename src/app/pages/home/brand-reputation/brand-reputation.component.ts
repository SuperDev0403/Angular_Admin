import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { MainService } from '../../../services/main/main.service';
import { User } from '../../../interfaces/user';
import { month_label } from '../data';
import { Widget, ChartType1, ChartType2 } from './reputation.model';
import { Router } from '@angular/router';
import { Marketplace, Client } from '../client/client.model';
import { Reviews } from '../review-management/review.model';

@Component({
  selector: 'app-brand-reputation',
  templateUrl: './brand-reputation.component.html',
  styleUrls: ['./brand-reputation.component.scss']
})
export class BrandReputationComponent implements OnInit {

  widgetData: Widget[];
  global_reputation: number;
  total_reviews: number;
  this_mon_reviews: number;
  seller_reputation: number;
  product_num: number;
  seller_num: number;
  positive_num: number;
  positive_pct: number;
  neutral_num: number;
  neutral_pct: number;
  negative_num: number;
  negative_pct: number;

  revenueRadialChart: ChartType1;
  stackBarChart: ChartType2;
  productReputationBarChart: ChartType2;
  sellerReputationBarChart: ChartType2;
  
  reviews: Array<Reviews>;
  marketplaces: Array<Marketplace>;
  clients: Array<Client>;

  current_marketplace_id=0;

  loading = false;
  loading_review = false;
  user: User;
  role = '';

  constructor(private router: Router, private authService: AuthService, private mainService: MainService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    
    this.role = this.user.role;
    if (this.role == 'client') {
      this.widgetData = [];
      this.getReviews();
      this.getReputation();
    } else {
      this.router.navigate(['/users']);
    }
  }

  getReputation() {
    this.loading = true;
    this.mainService.getReputation(this.current_marketplace_id, /*this.user.client_id*/8).subscribe((res: any) => {
      //global reputation
      this.global_reputation = res.global_reputation[0].global_reputation;
      let global_reputation_text = '';
      if (this.global_reputation > 4.3)
        global_reputation_text = 'Excellent';
      else if (this.global_reputation > 3.1)
        global_reputation_text = 'Good';
      else if (this.global_reputation > 1.6)
        global_reputation_text = 'Average';
      else
        global_reputation_text = 'Poor';
      this.widgetData.push(
        {
          icon: 'dripicons-trophy',
          color: 'primary',
          value: global_reputation_text,
          text: 'Global Reputation'
        }     
      )

      //total reviews
      this.total_reviews = res.total_review_num[0].total_reviews_cnt;
      this.widgetData.push(
        {
          icon: 'dripicons-star',
          color: 'success',
          value: this.total_reviews.toString(),
          text: 'Total Reviews'
        }     
      )
      
      //this month reviews
      this.this_mon_reviews = res.review_num[0].total_reviews_cnt;
      this.widgetData.push(
        {
          icon: 'fe-clipboard',
          color: 'info',
          value: this.this_mon_reviews.toString(),
          text: 'This Month Reviews'
        }     
      )

      //seller reputation
      this.seller_reputation = res.seller_reputation[0].seller_reputation;
      let seller_reputation_text = '';
      if (this.seller_reputation > 86)
        seller_reputation_text = 'Excellent';
      else if (this.seller_reputation > 62)
        seller_reputation_text = 'Good';
      else if (this.seller_reputation > 32)
        seller_reputation_text = 'Average';
      else
        seller_reputation_text = 'Poor';
      this.widgetData.push(
        {
          icon: 'fe-eye',
          color: 'warning',
          value: seller_reputation_text,
          text: 'Seller Reputation'
        }     
      )
      
      //total product rating
      this.revenueRadialChart = {
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
                        color: 'rgb(241, 85, 108)',
                        offsetY: 10,
                        formatter: (val) => {
                            return (val * 5 / 100).toFixed(1);
                        }
                    }
                }
            }
        },
        colors: ['rgb(241, 85, 108)'],
        series: [this.global_reputation * 100 / 5],
        stroke: {
            lineCap: 'round',
        },
      };
      let product_rating = res.product_rating;
      this.positive_num = product_rating.positive_num[0].total_reviews_cnt;
      let positive_pre_num :number = product_rating.positive_pre_num[0].total_reviews_cnt;
      if (positive_pre_num == 0)
      {
        if (this.positive_num == 0)
          this.positive_pct = 0;
        else
          this.positive_pct = 100;
      }else {
        this.positive_pct = Math.round((this.positive_num - positive_pre_num) * 100 / positive_pre_num + 0.5);
      }

      this.neutral_num = product_rating.neutral_num[0].total_reviews_cnt;
      let neutral_pre_num :number = product_rating.neutral_pre_num[0].total_reviews_cnt;
      if (neutral_pre_num == 0)
      {
        if (this.neutral_num == 0)
          this.neutral_pct = 0;
        else
          this.neutral_pct = 100;
      }else {
        this.neutral_pct = Math.round((this.neutral_num - neutral_pre_num) * 100 / neutral_pre_num + 0.5);
      }

      this.negative_num = product_rating.negative_num[0].total_reviews_cnt;
      let negative_pre_num :number = product_rating.negative_pre_num[0].total_reviews_cnt;
      if (negative_pre_num == 0)
      {
        if (this.negative_num == 0)
          this.negative_pct = 0;
        else
          this.negative_pct = 100;
      }else {
        this.negative_pct = Math.round((this.negative_num - negative_pre_num) * 100 / negative_pre_num + 0.5);
      }

      //review rating
      let mon = new Date().getMonth() + 1;
      let review_rating_labels = month_label.slice(0, mon);
      let star_rating = res.star_rating;
      let stack_data = [[], [], [], [], []];
      for (let i = 0; i < star_rating.length; i++)
      {
        stack_data[0].push(star_rating[i][0].s1);
        stack_data[1].push(star_rating[i][0].s2);
        stack_data[2].push(star_rating[i][0].s3);
        stack_data[3].push(star_rating[i][0].s4);
        stack_data[4].push(star_rating[i][0].s5);
      }
      this.stackBarChart = {
        chart: {
            height: 380,
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        colors: ['#ff2f32', '#ffa731', '#ffd731', '#69cdc9', '#02ada2'],
        series: [{
            name: '1 Star',
            data: stack_data[0]
        }, {
            name: '2 Stars',
            data: stack_data[1]
        }, {
            name: '3 Stars',
            data: stack_data[2]
        }, {
            name: '4 Stars',
            data: stack_data[3]
        }, {
            name: '5 Stars',
            data: stack_data[4]
        }],
        xaxis: {
            categories: review_rating_labels,
        },
        legend: {
            offsetY: -10,
        },
        yaxis: {
            
        },
        fill: {
            opacity: 1
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2
            },
            borderColor: '#f1f3fa'
        },
        tooltip: {
            y: {
                formatter(val) {
                    return val;
                }
            }
        }
      };

      let productReputation = [0, 0, 0, 0, 0];
      for (let i = 0; i < res.product_reputation.length; i++)
      {
        productReputation[res.product_reputation[i].product_review_rating - 1] = res.product_reputation[i].total_reviews_cnt;
      }
      this.productReputationBarChart = {
        chart: {
            height: 380,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        series: [{
            data: productReputation
        }],
        colors: ['#ff2f32', '#ffa731', '#ffd731', '#69cdc9', '#02ada2'],
        xaxis: {
            // tslint:disable-next-line: max-line-length
            categories: ['1', '2', '3', '4', '5'],
        },
        states: {
            hover: {
                filter: 'none'
            }
        },
        grid: {
            borderColor: '#f1f3fa'
        }
      };

      //seller rating reputation
      let sellerRatingReputation = [0, 0, 0, 0, 0];
      for (let i = 0; i < res.seller_rating_reputation.length; i++)
      {
        sellerRatingReputation[i] = res.seller_rating_reputation[i][0].seller_reputation;
      }
      this.sellerReputationBarChart = {
        chart: {
            height: 380,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        series: [{
            data: sellerRatingReputation
        }],
        colors: ['#ff2f32', '#ffa731', '#ffd731', '#69cdc9', '#02ada2'],
        xaxis: {
            // tslint:disable-next-line: max-line-length
            categories: ['1', '2', '3', '4', '5'],
        },
        states: {
            hover: {
                filter: 'none'
            }
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function () {
                return ''
              }
            }
          }
        },
        grid: {
            borderColor: '#f1f3fa'
        }
      };

      //product, seller number
      this.product_num = res.product_num;
      this.seller_num = res.seller_num;

      this.loading = false;
    });
  }

  getReviews() {
    this.loading_review = true;
    this.mainService.getReviews().subscribe((res: any) => {
      this.reviews = res.reviews;
      this.clients = res.clients;
      this.marketplaces = res.marketplaces;
      for (let i = 0; i < this.reviews.length; i++) {
        for (let j = 0; j < this.clients.length; j++) {
          if (this.reviews[i].product_client_id == this.clients[j].client_id) {
            this.reviews[i].client_name = this.clients[j].client_name;
            break;
          }
        }

        for (let j = 0; j < this.marketplaces.length; j++) {
          if (this.reviews[i].product_review_marketplace_id == this.marketplaces[j].marketplace_id) {
            this.reviews[i].marketplace_code = this.marketplaces[j].marketplace_code;
            break;
          }
        }

        for (let j = 0; j < res.statuses.length; j++) {
          if (this.reviews[i].product_review_amazon_id == res.statuses[j].product_review_status_amazon_id) {
            this.reviews[i].product_review_status_type_name = res.statuses[j].product_review_status_type_name;
            this.reviews[i].product_review_status_id = res.statuses[j].product_review_status_id;
            this.reviews[i].product_review_status_user_id = res.statuses[j].product_review_status_user_id;
            break;
          }
        }
      }
      this.loading_review = false;
    });
  }

  onChangeMarketplacecode(marketplace_id: any)
  {
    this.current_marketplace_id = marketplace_id;
  }
}
