import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { BookStoreComponent } from './book-store/book-store.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

@NgModule({
  declarations: [BookStoreComponent, UserOrdersComponent, MaintenanceComponent],
  imports: [SharedModule],
})
export class BooksModule {}
