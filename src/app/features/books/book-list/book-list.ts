import { Component, input, output } from '@angular/core';
import { BookItemComponent } from '../book-item/book-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-list',
  imports: [BookItemComponent, CommonModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookListComponent {
  books = input<Book[]>([]);

  delete = output<number>();
  toggle = output<number>();
  edit = output<Book>();
}
