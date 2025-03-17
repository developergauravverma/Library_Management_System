import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order, User } from '../../../models/models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'page-table',
  standalone: false,
  templateUrl: './page-table.component.html',
  styleUrl: './page-table.component.scss',
})
export class PageTableComponent {
  @Input()
  columns: string[] = [];

  @Input()
  dataSource: any[] = [];

  @Output()
  approve = new EventEmitter<User>();

  getFineToPay(order:Order):number{
    return this.api.GetFineToPay(order);
  }

  constructor(private api:ApiService){}
}
