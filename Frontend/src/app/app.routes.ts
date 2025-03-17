import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { BookStoreComponent } from './books/book-store/book-store.component';
import { UserOrdersComponent } from './users/user-orders/user-orders.component';
import { ProfileComponent } from './users/profile/profile.component';
import { MaintenanceComponent } from './books/maintenance/maintenance.component';
import { ReturnBookComponent } from './books/return-book/return-book.component';
import { ApprovalRequestComponent } from './users/approval-request/approval-request.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: BookStoreComponent },
  { path: 'my-orders', component: UserOrdersComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'return-book', component: ReturnBookComponent },
  { path: 'approval-request', component: ApprovalRequestComponent },
  { path: '**', component: PageNotFoundComponent },
];
