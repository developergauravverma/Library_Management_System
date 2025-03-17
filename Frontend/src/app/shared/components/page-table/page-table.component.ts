import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../models/models';

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
  dataSource: User[] = [];

  @Output()
  approve = new EventEmitter<User>();
}
