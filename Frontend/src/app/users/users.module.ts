import { NgModule } from '@angular/core';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [UserOrdersComponent, ProfileComponent],
  imports: [SharedModule],
})
export class UsersModule {}
