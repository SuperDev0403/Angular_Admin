import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { AdvancedService } from './asin-management.service';
import { AdvancedSortableDirective, SortEvent } from '../sortable.directive';

import { AuthService } from '../../../services/auth/auth.service';
import { MainService } from '../../../services/main/main.service';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { User } from '../../../interfaces/user';
import { TranslateService } from '@ngx-translate/core';
import { Asins } from './asin.model';
import { Client, Marketplace } from '../client/client.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert';
import { AngularCsv } from 'angular7-csv';


@Component({
  selector: 'app-asin-management',
  templateUrl: './asin-management.component.html',
  styleUrls: ['./asin-management.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class AsinManagementComponent implements OnInit {

  user: User;
  role = '';

  // bread crum data
  breadCrumbItems: Array<{}>;

  // Table data
  asinsList: Asins[];
  marketplaces: Array<Marketplace>;
  clients: Array<Client>;

  loading = false;
  importing = false;

  tables$: Observable<Asins[]>;
  total$: Observable<number>;

  currentAsin: any;
  submitted: boolean;
  // validation form
  validationform: FormGroup;


  title: string;
  enabled = ["Disabled", "Enabled"];

  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

  constructor(public service: AdvancedService, private modalService: NgbModal, private authService: AuthService, public formBuilder: FormBuilder, private router: Router, private mainService: MainService, private calendar: NgbCalendar, private route: ActivatedRoute, private translate: TranslateService) { 
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    this.title = 'Asin Management'; 
    this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/', active: true }];

    this.validationform = this.formBuilder.group({
      product_asin: ['', [Validators.required]],
      product_module_price_msrp: [''],
    });

    this.currentAsin = {
      product_module_id: 0,
      product_module_product_id: 0,
      client_id: 0,
      client_name: '',
      product_asin: '',
      product_module_marketplace_id: 0,
      marketplace_code: '',
      product_module_is_review: 0,
      product_module_is_price: 0,
      product_module_price_msrp: 0,
      product_module_price_base: 0,
    };

    this.user = this.authService.getUser();
    this.role = this.user.role;
    this.getAsinListing();
  }

  getAsinListing() {
    this.loading = true;
    this.mainService.getAsinListing().subscribe((res: any) => {
      this.asinsList = res.asins;
      this.service.tableData = this.asinsList;
      this.clients = res.clients;
      this.marketplaces = res.marketplaces;
      this.loading = false;
    });
  }

  getAsinListing1() {
    this.mainService.getAsinListing().subscribe((res: any) => {
      this.asinsList = res.asins;
      this.service.tableData = this.asinsList;
      this.clients = res.clients;
      this.marketplaces = res.marketplaces;
    });
  }

  get form() {
    return this.validationform.controls;
  }

  openModal(content: string) {
    this.modalService.open(content, { centered: true });
  }

  addNewASIN() {
    if (this.validationform.valid) {
      this.mainService.addAsin(this.currentAsin).subscribe((res: any) => {
        if (res.status) {
          this.getAsinListing1();
        } else {
        }
      })
      this.validationform = this.formBuilder.group({
        product_module_id: 0,
        product_module_product_id: 0,
        client_id: 0,
        client_name: '',
        product_asin: '',
        product_module_marketplace_id: 0,
        marketplace_code: '',
        product_module_is_review: 0,
        product_module_is_price: 0,
        product_module_price_msrp: 0,
        product_module_price_base: 0,
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  editAsin() {
    if (this.validationform.valid) {
      this.mainService.editAsin(this.currentAsin).subscribe((res: any) => {
        if (res.status) {
          this.getAsinListing1();
        } else {
        }
      })
      this.validationform = this.formBuilder.group({
        product_module_id: 0,
        product_module_product_id: 0,
        client_id: 0,
        client_name: '',
        product_asin: '',
        product_module_marketplace_id: 0,
        marketplace_code: '',
        product_module_is_review: 0,
        product_module_is_price: 0,
        product_module_price_msrp: 0,
        product_module_price_base: 0,
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  addModal(content) {
    let client_id = 0;
    let client_name = '';
    if (this.clients.length > 0)
    {
      client_id = this.clients[0].client_id;
      client_name = this.clients[0].client_name;
    }
    let product_module_marketplace_id = 0;
    let marketplace_code = '';
    if (this.marketplaces.length > 0)
    {
      product_module_marketplace_id = this.marketplaces[0].marketplace_id;
      marketplace_code = this.marketplaces[0].marketplace_code;
    }

    this.currentAsin = {
      product_module_id: 0,
      product_module_product_id: 0,
      client_id: client_id,
      client_name: client_name,
      product_asin: '',
      product_module_marketplace_id: product_module_marketplace_id,
      marketplace_code: marketplace_code,
      product_module_is_review: 0,
      product_module_is_price: 0,
      product_module_price_msrp: 0,
      product_module_price_base: 0,
    };
    this.openModal(content);
  }

  editModal(item, content) {
    console.log(item);
    let is_review = false;
    if (item.product_module_is_review)
      is_review = true;
    let is_price = false;
    if (item.product_module_is_price)
      is_price = true;
    this.currentAsin = {
      product_module_id: item.product_module_id,
      product_module_product_id: item.product_module_product_id,
      client_id: item.client_id,
      client_name: item.client_name,
      product_asin: item.product_asin,
      product_module_marketplace_id: item.product_module_marketplace_id,
      marketplace_code: item.marketplace_code,
      product_module_is_review: is_review,
      product_module_is_price: is_price,
      product_module_price_msrp: item.product_module_price_msrp,
      product_module_price_base: item.product_module_price_base,
    };
    
    this.openModal(content);
  }

  removeASIN(item) {
    let label1 = '';
    this.translate.get('main.r_u_sure').subscribe((text:string) => { label1 = text; });
    let label2 = '';
    this.translate.get('Are you sure to delete this row?').subscribe((text:string) => { label2 = text; });
    swal({
      title: label1,
      text: label2,
      icon: "warning",
      dangerMode: true,
    })
      .then(willDelete => {
        if (willDelete) {
          this.mainService.removeAsin(item.product_module_id).subscribe((res: any) => {
            if (res.status) {
              this.getAsinListing1();
            } else {
            }
          })
        }
      });
  }

  onChangeClientname(client_id: any)
  {
    this.currentAsin.client_id = client_id;
    this.clients.forEach(client => {
      if (client.client_id == client_id)
        this.currentAsin.client_name = client.client_name;
    });
  }

  onChangeMarketplacecode(marketplace_id: any)
  {
    this.currentAsin.product_module_marketplace_id = marketplace_id;
    this.marketplaces.forEach(marketplace => {
      if (marketplace.marketplace_id == marketplace_id)
        this.currentAsin.marketplace_code = marketplace.marketplace_code;
    });
  }

  handleFileSelect(evt) {
    let fileList: FileList = evt.target.files;
    
    if(fileList.length > 0) {
        const formData = new FormData();
        formData.append('file', fileList[0]);
        this.importing = true;
        this.mainService.uploadFile(formData).subscribe((res: any) => {
          if (res.status) {
            this.asinsList = res.asins;
            this.service.tableData = this.asinsList;
            this.clients = res.clients;
            this.marketplaces = res.marketplaces;
          } else {
          }
          this.importing = false;
        });
    }
  }

  exportCSV() {
    let dd = this.calendar.getToday();
    let month1 = (dd.month < 10) ? '0' + dd.month : dd.month;
    let day1 = (dd.day < 10) ? '0' + dd.day : dd.day;
    let date = dd.year + '-' + month1 + '-' + day1;
    let filename = 'product-module_' + date;

    var exportData = [];
    for (let i = 0; i < this.asinsList.length; i++) {
      exportData.push({asin: this.asinsList[i].product_asin, client_id: this.asinsList[i].client_id, marketplace_id: this.asinsList[i].product_module_marketplace_id, product_module_msrp_price: this.asinsList[i].product_module_price_msrp, is_review: this.asinsList[i].product_module_is_review, is_price: this.asinsList[i].product_module_is_price});
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
      headers: ["ASIN", "client_id", "marketplace_id", "product_module_msrp_price", "is_review", "is_price"]
    };

    new AngularCsv(exportData, filename, options);
  }
}
