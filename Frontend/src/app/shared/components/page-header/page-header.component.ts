import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'page-header',
  standalone: false,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  name: string = '';
  loggedIn: boolean = false;

  constructor(private api: ApiService) {
    api.userStatus.subscribe({
      next: (res) => {
        if (res == 'loggedIn') {
          this.loggedIn = true;
          let user = api.GetUserInfo();
          this.name = `${user?.firstName} ${user?.lastName}`;
        } else {
          this.loggedIn = false;
          this.name = '';
        }
      },
    });
  }

  logout() {
    this.api.loggedOut();
  }
}
