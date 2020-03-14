import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../interfaces/user';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';

declare var $: any;

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss']
})
export class MyaccountComponent implements OnInit {

  breadCrumbItems: Array<{}>;

  old_password = '';
  new_password = '';
  new_password_confirm = '';
  error = '';

  user: User;

  title: string;

  constructor(private authService: AuthService, private translate: TranslateService) { }

  ngOnInit() {
    this.translate.get('menu.account').subscribe((text:string) => { 
      this.title = text; 
      this.breadCrumbItems = [{ label: 'Azzgency', path: '/' }, { label: this.title, path: '/', active: true }];
    });

    this.user = this.authService.getUser();
  }

  updatePassword() {
    let label1 = '';
    this.translate.get('main.fill_all_inputs').subscribe((text:string) => { label1 = text; });
    
    if (this.old_password == '' || this.new_password == '' || this.new_password_confirm == '') {
      this.error = label1;
      return;
    }

    let label2 = '';
    this.translate.get('main.password_dismatch').subscribe((text:string) => { label2 = text; });
    if (this.new_password != this.new_password_confirm) {
      this.error = label2;
      return;
    }
    this.authService.updatePassword(this.old_password, this.new_password_confirm, this.user.email).subscribe((res: any) => {
      if(res.status) {
        let label1 = '';
        this.translate.get('main.success').subscribe((text:string) => { label1 = text; });
        let label2 = '';
        this.translate.get('main.password_updated').subscribe((text:string) => { label2 = text; });

        this.error = "";
        
        swal({
          title: label1,
          text: label2,
          icon: "success",
          dangerMode: false,
        });
        
      } else {
        this.error = res.message;
      }
    })
  }
}
