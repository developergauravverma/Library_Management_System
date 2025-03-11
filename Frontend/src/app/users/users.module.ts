import { NgModule } from '@angular/core';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UserOrdersComponent],
  imports: [SharedModule],
})
export class UsersModule {}
