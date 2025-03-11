import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { BookStoreComponent } from './book-store/book-store.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';



@NgModule({
  declarations: [
    BookStoreComponent,
    UserOrdersComponent
  ],
  imports: [
    SharedModule
  ]
})
export class BooksModule { }
