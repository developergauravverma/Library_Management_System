import { NgModule } from '@angular/core';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { ApprovalRequestComponent } from './approval-request/approval-request.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';

@NgModule({
  declarations: [
    UserOrdersComponent,
    ProfileComponent,
    ApprovalRequestComponent,
    AllOrdersComponent,
  ],
  imports: [SharedModule],
})
export class UsersModule {}
