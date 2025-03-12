import { Component } from '@angular/core';
import { Order } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'user-orders',
  standalone: false,
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
})
export class UserOrdersComponent {
  columnsForPendingReturns: string[] = [
    'orderId',
    'bookId',
    'bookTitle',
    'orderDate',
    'fineToPay',
  ];
  columnsForCompletedReturns: string[] = [
    'orderId',
    'bookId',
    'bookTitle',
    'orderDate',
    'returnDate',
    'fineToPay',
  ];
  pendingReturns: Order[] = [];
  completedReturns: Order[] = [];

  constructor(private api: ApiService, private snackBar: MatSnackBar) {
    let userId: number = this.api.GetUserInfo()!.id;
    this.api.GetOrdersOfUser(userId).subscribe({
      next: (res: Order[]) => {
        this.pendingReturns = res.filter((x) => !x.returned);
        this.completedReturns = res.filter((x) => x.returned);
      },
    });
  }

  getFineToPay(order:Order): number{
    return this.api.GetFineToPay(order);
  }
}
