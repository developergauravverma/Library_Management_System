import { Book, BookCategory } from './../../models/models';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface CategoryOptions {
  displayValue: string;
  value: number;
}

@Component({
  selector: 'maintenance',
  standalone: false,
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
})
export class MaintenanceComponent {
  newCategory: FormGroup;
  newBook: FormGroup;
  categoryOption: CategoryOptions[] = [];

  constructor(
    fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.newCategory = fb.group({
      category: fb.control('', [Validators.required]),
      subCategory: fb.control('', [Validators.required]),
    });

    this.newBook = fb.group({
      title: fb.control('', [Validators.required]),
      author: fb.control('', [Validators.required]),
      price: fb.control('0', [Validators.required]),
      category: fb.control('-1', [Validators.required]),
    });

    api.GetBookCategory().subscribe({
      next: (res: BookCategory[]) => {
        this.categoryOption = [
          ...this.categoryOption,
          ...res.map((item) => ({
            value: item.id,
            displayValue: `${item.category} / ${item.subCategory}`,
          })),
        ];
      },
    });
  }

  addNewCategory() {
    let bookCategory: BookCategory = {
      id: 0,
      category: this.newCategory.get('category')?.value,
      subCategory: this.newCategory.get('subCategory')?.value,
    };

    this.api.AddNewCategory(bookCategory).subscribe({
      next: (res) => {
        if (res === 'cannot insert') {
          this.snackBar.open('Already Insert', 'Ok');
        } else {
          this.snackBar.open('Inserted', 'Ok');
        }
      },
    });
  }

  addNewBook() {
    let book: Book = {
      id: 0,
      title: this.newBook.get('title')?.value,
      author: this.newBook.get('author')?.value,
      bookCategoryId: this.newBook.get('category')?.value,
      price: this.newBook.get('price')?.value,
      ordered: false,
    };

    this.api.AddNewBook(book).subscribe({
      next: (res) => {
        if (res === 'Inserted') {
          this.snackBar.open('Book Added', 'Ok');
        } else {
          this.snackBar.open('something went worng', 'Ok');
        }
      },
    });
  }
}
