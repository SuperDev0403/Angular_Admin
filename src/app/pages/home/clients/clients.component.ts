import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main/main.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Users, Clients, Client_type } from './clients.model';


declare var $: any;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  users: Array<Users>;
  clients: Array<Clients>;
  client_types: Array<Client_type>;

  currentUser: any;
  currentClient: any;

  breadCrumbItems: Array<{}>;

  submitted: boolean;
  submitted_client: boolean;

  // validation form
  validationform: FormGroup;
  validationform_client: FormGroup;

  title: string;

  status = ["Inactive", "Active"];
  roles = ["client", "admin"];

  constructor(private mainService: MainService, private modalService: NgbModal, public formBuilder: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
    this.translate.get('menu.users').subscribe((text:string) => { 
      this.title = text; 
      this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/' }];
    });
    
    this.validationform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.validationform_client = this.formBuilder.group({
      client_name: ['', [Validators.required]],
      client_cif: '',
    });

    this.currentUser = {
      id: 0,
      name: '',
      email: '',
      password: '',
      client_id: 0,
      client_name: '',
      role: 'client',
      is_active: 0
    };
    this.currentClient = {
      client_id: 0,
      client_name: '',
      client_cif: '',
      client_type_id: 0,
      client_type_platform: '',
      client_is_active: 0
    }    

    this.loadUsers();
  }

    /**
   * Returns form
   */
  get form() {
    return this.validationform.controls;
  }
  get form_client() {
    return this.validationform_client.controls;
  }
  /**
   * Modal Open
   * @param content modal content
   */
  openModal(content: string) {
    this.modalService.open(content, { centered: true });
  }
  openCModal(content: string) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * save the contacts data
   */
  addNewUser() {
    if (this.validationform.valid) {
      this.mainService.addUser(this.currentUser).subscribe((res: any) => {
        if (res.status) {
          this.loadUsers();
        } else {
        }
      })
      this.validationform = this.formBuilder.group({
        id: 0,
        name: '',
        email: '',
        password: '',
        client_id: 0,
        client_name: '',
        role: 'client',
        is_active: 0
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }
  addNewClient() {
    if (this.validationform_client.valid) {
      this.mainService.addClient(this.currentClient).subscribe((res: any) => {
        if (res.status) {
          this.loadUsers();
        } else {
        }
      })
      this.validationform_client = this.formBuilder.group({
        client_id: 0,
        client_name: '',
        client_cif: '',
        client_type_id: 0,
        client_type_platform: '',
        client_is_active: 0
      });
      this.modalService.dismissAll();
    }
    this.submitted_client = true;
  }

  editUser() {
    if (this.validationform.valid) {
      this.mainService.editUser(this.currentUser).subscribe((res: any) => {
        if (res.status) {
          this.loadUsers();
        } else {
        }
      })
      this.validationform = this.formBuilder.group({
        id: 0,
        name: '',
        email: '',
        password: '',
        client_id: 0,
        client_name: '',
        role: 'client',
        is_active: 0
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }
  editClient() {
    if (this.validationform_client.valid) {
      this.mainService.editClient(this.currentClient).subscribe((res: any) => {
        if (res.status) {
          this.loadUsers();
        } else {
        }
      })
      this.validationform_client = this.formBuilder.group({
        client_id: 0,
        client_name: '',
        client_cif: '',
        client_type_id: 0,
        client_type_platform: '',
        client_is_active: 0
      });
      this.modalService.dismissAll();
    }
    this.submitted_client = true;
  }

  loadUsers() {
    this.mainService.getUsers().subscribe((res: any) => {
      if (res.users) {
        this.users = res.users;
        this.clients = res.clients;
        this.client_types = res.client_types;
      }
    })
  }

  addModal(content) {
    this.validationform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    let client_id = 0;
    let client_name = '';
    if (this.clients.length > 0)
    {
      client_id = this.clients[0].client_id;
      client_name = this.clients[0].client_name;
    }
    this.currentUser = {
      id: 0,
      name: '',
      email: '',
      password: '',
      client_id: client_id,
      client_name: client_name,
      role: 'client',
      is_active: 0
    };
    this.openModal(content);
  }
  addCModal(content) {
    let client_type_id = 0;
    let client_type_platform = '';
    if (this.client_types.length > 0)
    {
      client_type_id = this.client_types[0].client_type_id;
      client_type_platform = this.client_types[0].client_type_platform;
    }
    this.currentClient = {
      client_id: 0,
      client_name: '',
      client_cif: '',
      client_type_id: client_type_id,
      client_type_platform: client_type_platform,
      client_is_active: 0
    };
    this.openCModal(content);
  }

  editModal(item, content) {
    this.validationform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      name: ['', [Validators.required]],
      password: [''],
    });
    this.currentUser = {
      id: item.id,
      name: item.name,
      email: item.email,
      client_id: item.client_id,
      client_name: item.client_name,
      password: '',
      role: item.role,
      is_active: parseInt(item.is_active)
    };
    
    this.openModal(content);
  }
  editCModal(item, content) {
    this.currentClient = {
      client_id: item.client_id,
      client_name: item.client_name,
      client_cif: item.client_cif,
      client_type_id: item.client_type_id,
      client_type_platform: item.client_type_platform,
      client_is_active: parseInt(item.client_is_active)
    };
    
    this.openCModal(content);
  }

  removeUser(item) {
    let label1 = '';
    this.translate.get('main.r_u_sure').subscribe((text:string) => { label1 = text; });
    let label2 = '';
    this.translate.get('main.del_user_msg').subscribe((text:string) => { label2 = text; });
    swal({
      title: label1,
      text: label2,
      icon: "warning",
      dangerMode: true,
    })
      .then(willDelete => {
        if (willDelete) {
          this.mainService.removeUser(item.id).subscribe((res: any) => {
            if (res.status) {
              this.loadUsers();
            } else {
            }
          })
        }
      });
  }
  removeClient(item) {
    let label1 = '';
    this.translate.get('main.r_u_sure').subscribe((text:string) => { label1 = text; });
    let label2 = '';
    this.translate.get('main.del_client_msg').subscribe((text:string) => { label2 = text; });
    swal({
      title: label1,
      text: label2,
      icon: "warning",
      dangerMode: true,
    })
      .then(willDelete => {
        if (willDelete) {
          this.mainService.removeClient(item.client_id).subscribe((res: any) => {
            if (res.status) {
              this.loadUsers();
            } else {
            }
          })
        }
      });
  }

  onChangeClientname(client_id: any)
  {
    this.currentUser.client_id = client_id;
    this.clients.forEach(client => {
      if (client.client_id == client_id)
        this.currentUser.client_name = client.client_name;
    });
  }

  onChangeRole(role: any)
  {
    this.currentUser.role = role;
  }

  onChangeClienttype(client_type_id: any)
  {
    this.currentClient.client_type_id = client_type_id;
  }
}
