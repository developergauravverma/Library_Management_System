import { Component } from '@angular/core';
import { AccountStatus, User } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'approval-request',
  standalone: false,
  templateUrl: './approval-request.component.html',
  styleUrl: './approval-request.component.scss',
})
export class ApprovalRequestComponent {
  columns: string[] = [
    'userId',
    'userName',
    'email',
    'userType',
    'createdOn',
    'approve',
  ];
  users: User[] = [];

  constructor(private api: ApiService, private snackBar: MatSnackBar) {
    api.GetUsers().subscribe({
      next: (res: User[]) => {
        this.users = res.filter(
          (u) => u.accountStatus === AccountStatus.UNAPROOVED
        );
      },
    });
  }

  approve(user: User) {
    console.log(user);
    this.api.ApproveRequest(user.id).subscribe({
      next: (res: string) => {
        if (res === 'approved') {
          this.snackBar.open(`Approved for ${user.id}`, 'Ok');
          this.api.GetUsers().subscribe({
            next: (res: User[]) => {
              this.users = res.filter(
                (u) => u.accountStatus === AccountStatus.UNAPROOVED
              );
            },
          });
        } else {
          this.snackBar.open('Not Approve', 'Ok');
        }
      },
    });
  }
}
