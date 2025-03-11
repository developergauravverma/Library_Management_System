import { Component } from '@angular/core';
import { Book, BooksByCategory } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'book-store',
  standalone: false,
  templateUrl: './book-store.component.html',
  styleUrl: './book-store.component.scss',
})
export class BookStoreComponent {
  displayedColumns: string[] = [
    'id',
    'title',
    'author',
    'price',
    'available',
    'order',
  ];

  booksToDisplay: BooksByCategory[] = [];
  books: Book[] = [];

  constructor(private api: ApiService, private snackbar: MatSnackBar) {
    this.api.getBooks().subscribe({
      next: (res: Book[]) => {
        this.books = [];
        res.forEach((book) => this.books.push(book));
        this.UpdateBookList();
      },
    });
  }

  UpdateBookList() {
    if (this.books != null && this.books.length > 0) {
      this.booksToDisplay = [];
      this.books.forEach((book) => {
        let categoryExists = false;
        let categoryBook: BooksByCategory | null;

        this.booksToDisplay.forEach((bd) => {
          if (bd.category == book.bookCategory.category) {
            categoryExists = true;
            categoryBook = bd;
          }
        });

        if (categoryExists) {
          categoryBook!.books.push(book);
        } else {
          this.booksToDisplay.push({
            bookCategoryId: book.bookCategoryId,
            category: book.bookCategory.category,
            subCategory: book.bookCategory.subCategory,
            books: [book],
          });
        }
      });
    }
  }
  searchBoxs(value: string) {
    value = value.toLowerCase();
    this.UpdateBookList();
    this.booksToDisplay = this.booksToDisplay.filter((bookToDisplay) => {
      bookToDisplay.books = bookToDisplay.books.filter((book) => {
        return book.title.toLowerCase().includes(value);
      });
      return bookToDisplay.books.length > 0;
    });
  }

  GetBookCount(): number {
    let count = 0;
    this.booksToDisplay.forEach((book) => (count += book.books.length));
    return count;
  }
}
