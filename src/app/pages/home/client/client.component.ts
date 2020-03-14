import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main/main.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Client, Client_module, Marketplace } from './client.model';


declare var $: any;

@Component({
  selector: 'app-clients',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  client_modules: Array<Client_module>;
  marketplaces: Array<Marketplace>;
  clients: Array<Client>;

  currentClientmodule: any;

  breadCrumbItems: Array<{}>;

  submitted: boolean;

  // validation form
  validationform: FormGroup;

  title: string;

  status = ['Inactive', 'Active'];
  enabled = ['Disabled', 'Enabled'];

  constructor(private mainService: MainService, private modalService: NgbModal, public formBuilder: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
    this.translate.get('menu.client_modules').subscribe((text:string) => { 
      this.title = text; 
      this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/' }];
    });
    
    this.validationform = this.formBuilder.group({
      client_module_id: 0,
      client_module_client_id: 0,
      client_module_marketplace_id: 0,
      client_module_is_review: 0, 
      client_module_is_content: 0,
      client_module_is_price: 0,
      client_module_is_answers: 0,
      client_module_is_po: 0,
      client_module_is_active: 0,
      client_name: '',
      marketplace_code: ''
    });

    this.currentClientmodule = {
      client_module_id: 0,
      client_module_client_id: 0,
      client_module_marketplace_id: 0,
      client_module_is_review: 0, 
      client_module_is_content: 0,
      client_module_is_price: 0,
      client_module_is_answers: 0,
      client_module_is_po: 0,
      client_module_is_active: 0,
      client_name: '',
      marketplace_code: ''
    };

    this.loadClientmodules();
  }

    /**
   * Returns form
   */
  get form() {
    return this.validationform.controls;
  }
  /**
   * Modal Open
   * @param content modal content
   */
  openModal(content: string) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * save the contacts data
   */
  addClientmodule() {
    if (this.validationform.valid) {
      this.mainService.addClientmodule(this.currentClientmodule).subscribe((res: any) => {
        if (res.status) {
          this.loadClientmodules();
        } else {
        }
      })
      this.validationform = this.formBuilder.group({
        client_module_id: 0,
        client_module_client_id: 0,
        client_module_marketplace_id: 0,
        client_module_is_review: 0, 
        client_module_is_content: 0,
        client_module_is_price: 0,
        client_module_is_answers: 0,
        client_module_is_po: 0,
        client_module_is_active: 0,
        client_name: '',
        marketplace_code: ''
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  editClientmodule() {
    if (this.validationform.valid) {
      this.mainService.editClientmodule(this.currentClientmodule).subscribe((res: any) => {
        if (res.status) {
          this.loadClientmodules();
        } else {
        }
      })
      this.validationform = this.formBuilder.group({
        client_module_id: 0,
        client_module_client_id: 0,
        client_module_marketplace_id: 0,
        client_module_is_review: 0, 
        client_module_is_content: 0,
        client_module_is_price: 0,
        client_module_is_answers: 0,
        client_module_is_po: 0,
        client_module_is_active: 0,
        client_name: '',
        marketplace_code: ''
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  loadClientmodules() {
    this.mainService.getClientmodules().subscribe((res: any) => {
      if (res.client_modules) {
        this.client_modules = res.client_modules;
        this.clients = res.clients;
        this.marketplaces = res.marketplaces;
      }
    })
  }

  addModal(content) {
    let client_module_client_id = 0;
    if (this.clients.length > 0)
      client_module_client_id = this.clients[0].client_id;
    let client_module_marketplace_id = 0;
    if (this.marketplaces.length > 0)
      client_module_marketplace_id = this.marketplaces[0].marketplace_id;

    this.currentClientmodule = {
      client_module_id: 0,
      client_module_client_id: client_module_client_id,
      client_module_marketplace_id: client_module_marketplace_id,
      client_module_is_review: 0, 
      client_module_is_content: 0,
      client_module_is_price: 0,
      client_module_is_answers: 0,
      client_module_is_po: 0,
      client_module_is_active: 0,
      client_name: '',
      marketplace_code: ''
    };
    this.openModal(content);
  }

  editModal(item, content) {
    this.currentClientmodule = {
      client_module_id: item.client_module_id,
      client_module_client_id: item.client_module_client_id,
      client_module_marketplace_id: item.client_module_marketplace_id,
      client_module_is_review: parseInt(item.client_module_is_review), 
      client_module_is_content: parseInt(item.client_module_is_content),
      client_module_is_price: parseInt(item.client_module_is_price),
      client_module_is_answers: parseInt(item.client_module_is_answers),
      client_module_is_po: parseInt(item.client_module_is_po),
      client_module_is_active: parseInt(item.client_module_is_active),
      client_name: item.client_name,
      marketplace_code: item.marketplace_code
    };
    this.openModal(content);
  }

  removeClientmodule(item) {
    let label1 = '';
    this.translate.get('main.r_u_sure').subscribe((text:string) => { label1 = text; });
    let label2 = '';
    this.translate.get('main.del_client_module_msg').subscribe((text:string) => { label2 = text; });
    swal({
      title: label1,
      text: label2,
      icon: "warning",
      dangerMode: true,
    })
      .then(willDelete => {
        if (willDelete) {
          this.mainService.removeClientmodule(item.client_module_id).subscribe((res: any) => {
            if (res.status) {
              this.loadClientmodules();
            } else {
            }
          })
        }
      });
  }

  onChangeClientname(client_id: any)
  {
    this.currentClientmodule.client_module_client_id = client_id;
    this.clients.forEach(client => {
      if (client.client_id == client_id)
        this.currentClientmodule.client_name = client.client_name;
    });
  }

  onChangeMarketplacecode(marketplace_id: any)
  {
    this.currentClientmodule.client_module_marketplace_id = marketplace_id;
    this.marketplaces.forEach(marketplace => {
      if (marketplace.marketplace_id == marketplace_id)
        this.currentClientmodule.client_module_marketplace_name = marketplace.marketplace_code;
    });
    console.log(this.currentClientmodule);
  }
}
