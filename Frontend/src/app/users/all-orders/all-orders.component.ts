import { Component } from '@angular/core';
import { Order } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'all-orders',
  standalone: false,
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent {
  columnsForPendingReturns: string[] = [
    'orderId',
    'userIdForOrder',
    'userNameForOrder',
    'bookId',
    'orderDate',
    'fineToPay',
  ];

  columnsForCompletedResult: string[] = [
    'orderId',
    'userIdForOrder',
    'userNameForOrder',
    'bookId',
    'orderDate',
    'returnedDate',
    'finePaid',
  ]

  ordersWithPendingReturns:Order[] = [];
  ordersWithCompletedResult:Order[] = [];
  showProgressBar:boolean = false;

  constructor(private api:ApiService, private snackBar:MatSnackBar){
    this.api.GetOrders().subscribe({
      next: (res:Order[]) => {
        this.ordersWithPendingReturns = res.filter(o => !o.returned);
        this.ordersWithCompletedResult = res.filter(o => o.returned);
      },
      error:(error:any) => {
        this.snackBar.open("No order found","Ok");
      }
    })
  }

  sendEmail(){
    this.showProgressBar = true;

    this.api.SendEmail().subscribe({
      next: (res:string) => {
        if(res === "sent"){
          this.snackBar.open("Email have send to respected Students!","Ok");
          this.showProgressBar = false;
        }
        else{
          this.snackBar.open("Email Have not been send!","Ok");
          this.showProgressBar = false;
        }
      },
      error: (error:any) => {
        this.snackBar.open("Something went wrong!","Ok");
        this.showProgressBar = false;
      }
    })
  }

  blockUser(){
    this.showProgressBar = true;

    this.api.BlockUser().subscribe({
      next: (res:string) => {
        if(res === "blocked"){
          this.snackBar.open("Eligible Users accounts were BLOCKED.!","Ok");
          this.showProgressBar = false;
        }
        else{
          this.snackBar.open("Not BLOCKED!","Ok");
          this.showProgressBar = false;
        }
      },
      error: (error:any) => {
        this.snackBar.open("Something went wrong!","Ok");
        this.showProgressBar = false;
      }
    })
  }
}
