import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { UserType } from '../../models/models';

export interface TableElement {
  name: string;
  value: string;
}

@Component({
  selector: 'profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  column: string[] = ['name', 'value'];
  dataSource: TableElement[] = [];
  constructor(private api: ApiService) {
    let user = api.GetUserInfo();
    this.dataSource = [
      { name: 'Name', value: user?.firstName + ' ' + user?.lastName },
      { name: 'Email', value: `${user?.email}` },
      { name: 'Mobile', value: `${user?.mobileNumber}` },
      { name: 'Account Status', value: `${user?.accountStatus}` },
      {
        name: 'Created On',
        value: `${user?.createOn}`,
      },
      { name: 'Type', value: `${UserType[user?.userType!]}` },
    ];
  }
}
