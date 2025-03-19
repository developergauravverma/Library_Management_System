import { Component } from '@angular/core';
import { AccountStatus, User, UserType } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'view-users',
  standalone: false,
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.scss',
})
export class ViewUsersComponent {
  columns: string[] = [
    'userId',
    'userName',
    'email',
    'mobileNumber',
    'createdOn',
    'accountStatus',
    'unBlock',
    'userType',
  ];
  users: User[] = [];

  constructor(private api: ApiService, private snackBar: MatSnackBar) {
    this.getUserForTable();
  }

  getUserForTable(): void {
    this.api.GetUsers().subscribe({
      next: (res: User[]) => {
        this.users = [];
        this.users = [
          ...this.users,
          ...res.map((u) => ({
            ...u,
            accountStatusString: AccountStatus[u.accountStatus],
          })),
        ];
      },
    });
  }

  unblockUser(user: User) {
    let userId = user.id;
    this.api.UnBlock(userId).subscribe({
      next: (res: string) => {
        if (res === 'unblocked') {
          //this.getUserForTable();
          this.users = this.users.map((u) => {
            if (u.id === user.id) {
              return {
                ...u,
                accountStatus: AccountStatus.ACTIVE,
                accountStatusString: AccountStatus[AccountStatus.ACTIVE],
              };
            }
            return u;
          });
          this.snackBar.open('User is successfully unblocked!', 'Ok');
        } else {
          this.snackBar.open('User is not successfully unblocked!', 'Ok');
        }
      },
    });
  }
}
