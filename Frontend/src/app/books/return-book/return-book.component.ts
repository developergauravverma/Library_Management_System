import { Order } from './../../models/models';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'return-book',
  standalone: false,
  templateUrl: './return-book.component.html',
  styleUrl: './return-book.component.scss',
})
export class ReturnBookComponent {
  returnBook: FormGroup;
  fineToPay: number = 0;

  constructor(
    fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.returnBook = fb.group({
      userId: fb.control(null, [Validators.required]),
      bookId: fb.control(null, [Validators.required]),
    });
  }

  getFine() {
    let userId: number = parseInt(this.returnBook.get('userId')?.value);
    let bookId: number = parseInt(this.returnBook.get('bookId')?.value);

    this.api.GetOrdersOfUser(userId).subscribe({
      next: (res: Order[]) => {
        if (res.some((o) => !o.returned && o.bookId === bookId)) {
          let order: Order = res.filter((o) => o.bookId === bookId)[0];
          this.fineToPay = this.api.GetFineToPay(order);
        } else {
          this.snackBar.open(`User doesn't have book with Id: ${bookId}`, 'Ok');
        }
      },
    });
  }

  returnBookBtn() {
    let userId: number = parseInt(this.returnBook.get('userId')?.value);
    let bookId: number = parseInt(this.returnBook.get('bookId')?.value);
    this.api.returnBook(userId, bookId, this.fineToPay).subscribe({
      next: (res: string) => {
        if (res === 'returned') {
          this.snackBar.open('Book has been returned!', 'Ok');
        } else {
          this.snackBar.open('Book has not returned!', 'Ok');
        }
      },
    });
  }
}
