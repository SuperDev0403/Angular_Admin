import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { User } from '../../interfaces/user';

declare var $: any;

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  user: User;
  role = '';

  openMobileMenu: boolean;

  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    } else {
      this.role = this.user.role;
    }

    this.openMobileMenu = false;
  }


  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }
}
