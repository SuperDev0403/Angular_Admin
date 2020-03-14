import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';


import { AuthService } from '../../../services/auth/auth.service';
import { MainService } from '../../../services/main/main.service';
import { AdvancedService } from './review-management.service';
import { AdvancedSortableDirective, SortEvent } from '../sortable.directive';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { User } from '../../../interfaces/user';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';


import { Client, Marketplace } from '../client/client.model';
import { Reviews, Notes } from './review.model';

declare var $: any;

@Component({
  selector: 'app-review-management',
  templateUrl: './review-management.component.html',
  styleUrls: ['./review-management.component.scss'],
  providers: [AdvancedService, DecimalPipe, NgbRatingConfig],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .my-custom-class .tooltip-inner {
      background-color: gray;
      font-size: 100%;
    }
    .my-custom-class .arrow::before {
      border-top-color: gray;
    }
  `]
})
export class ReviewManagementComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  user: User;
  role = '';

  reviews: Array<Reviews>;
  marketplaces: Array<Marketplace>;
  clients: Array<Client>;
  notes: Array<Notes>;

  loading = false;


  title: string;
  tables$: Observable<Reviews[]>;
  total$: Observable<number>;

  currentDate: Date;
  current: String;
  monthbefore: String;

  constructor(public service: AdvancedService, private authService: AuthService, private mainService: MainService, config: NgbRatingConfig) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {

    this.title = "Review Management";
    this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/' }];

    this.user = this.authService.getUser();//this.user.id
    this.role = this.user.role;

    this.getReviews();

    this.currentDate = new Date();
    var month = '' + (this.currentDate.getMonth() + 1);
    var day = '' + this.currentDate.getDate();
    var year = this.currentDate.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    this.current = year + '-' + month + '-' + day;
    var month1 = '' + (this.currentDate.getMonth());
    if (month1.length < 2)
      month1 = '0' + month1;
    this.monthbefore = year + '-' + month1 + '-' + day;
  }

  getReviews() {
    this.loading = true;
    this.mainService.getReviews().subscribe((res: any) => {
      this.reviews = res.reviews;
      this.clients = res.clients;
      this.marketplaces = res.marketplaces;
      this.notes = res.notes;
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

        this.reviews[i].product_review_status_id = 0;
        this.reviews[i].product_review_status_type_name = "New";
        for (let j = 0; j < res.statuses.length; j++) {
          if (this.reviews[i].product_review_amazon_id == res.statuses[j].product_review_status_amazon_id) {
            this.reviews[i].product_review_status_type_name = res.statuses[j].product_review_status_type_name;
            this.reviews[i].product_review_status_id = res.statuses[j].product_review_status_id;
            this.reviews[i].product_review_status_user_id = res.statuses[j].product_review_status_user_id;
            break;
          }
        }
      }
      this.service.tableData = this.reviews;
      this.loading = false;
    });
  }

  doneClick(event) {
    var id = event.target.id;
    for (let i = 0; i < this.reviews.length; i++) {
      if (this.reviews[i].product_review_amazon_id == id) {
        this.reviews[i].product_review_status_type_name = "Done";
        break;
      }
    }
    this.service.tableData = this.reviews;
  }

  workClick(event) {
    var id = event.target.id;
    for (let i = 0; i < this.reviews.length; i++) {
      if (this.reviews[i].product_review_amazon_id == id) {
        this.reviews[i].product_review_status_type_name = "Work in progress";
        break;
      }
    }
    this.service.tableData = this.reviews;
  }

  addClick(event) {
    var id = event.target.id;
    $('.comment_group #' + id).css('display', 'block');
    $('#' + id + ' input[type=text]').val("")
  }

  cancelClick(event) {
    var id = event.target.id;
    $('.comment_group #' + id).css('display', 'none');
  }

  saveClick(event) {
    // get current Date start
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + '/' +
      (month < 10 ? '0' : '') + month + '/' +
      (day < 10 ? '0' : '') + day;
    // get current Date end

    var id = event.target.id;
    var c_con = $('#' + id + ' input[type=text]').val();
    if (c_con == "") {
      alert("Please input Comment!")
    } else {
      this.notes.push({ product_review_note_id: 0, product_review_amazon_id: id, product_review_user_id: this.user.id, product_review_datetime_created: output, product_review_note: c_con });
      console.log(this.notes)
      $('.comment_group #' + id).css('display', 'none');
    }
  }


}
