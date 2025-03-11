import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { User, UserType } from '../../../models/models';

export interface NavigationItem {
  id: number;
  value: string;
  link: string;
}

@Component({
  selector: 'page-side-nav',
  standalone: false,
  templateUrl: './page-side-nav.component.html',
  styleUrl: './page-side-nav.component.scss',
})
export class PageSideNavComponent {
  panelName: string = '';

  navItem: NavigationItem[] = [];

  constructor(private api: ApiService, private routes: Router) {
    this.api.userStatus.subscribe({
      next: (res) => {
        if (res == 'loggedIn') {
          routes.navigateByUrl('/home');
          let user = this.api.GetUserInfo();
          if (user != null) {
            if (user.userType == UserType.ADMIN) {
              this.panelName = 'Admin Panel';
              this.navItem = [
                { id: 1, value: 'View Books', link: '/home' },
                { id: 2, value: 'Maintenance', link: '/maintenance' },
                { id: 3, value: 'Return Book', link: '/return-book' },
                { id: 4, value: 'View Users', link: '/view-users' },
                { id: 5, value: 'Approval Request', link: '/approval-request' },
                { id: 6, value: 'All Orders', link: '/all-orders' },
                { id: 7, value: 'My Orders', link: '/my-orders' },
              ];
            } else if (user.userType == UserType.STUDENT) {
              this.panelName = 'Student Panel';
              this.navItem = [
                { id: 1, value: 'View Books', link: '/home' },
                { id: 2, value: 'My Orders', link: '/my-orders' },
              ];
            }
          }
        } else if (res == 'loggedOff') {
          this.panelName = 'Auth Panel';
          routes.navigateByUrl('/login');
          this.navItem = [];
        }
      },
    });
  }
}
