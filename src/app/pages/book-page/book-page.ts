import { Component, OnInit, signal, Signal } from '@angular/core';
import { BookService } from '../../core/services/book';
import { BookFormComponent } from "../../features/books/book-form/book-form";
import { BookListComponent } from "../../features/books/book-list/book-list";

@Component({
  selector: 'app-book-page',
  imports: [BookFormComponent, BookListComponent],
  templateUrl: './book-page.html',
  styleUrl: './book-page.css',
})
export class BookPageComponent implements OnInit {
  books!: Signal<Book[]>;
  editingBook = signal<Book | null>(null);

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.books = this.bookService.getBooks();
  }

  onEditBook(book: Book) {
    this.editingBook.set(book);
  }

  onAddBook(dto: CreateBookDto) {
    const editing = this.editingBook();
    if (editing) {
      this.bookService.editBook(
        editing.id,
        dto.title,
        dto.author,
        dto.year);
      this.editingBook.set(null);
    } 
    else 
      {
      this.bookService.addBook(
        dto.title,
        dto.author,
        dto.year);
    }
  }
  
  onDeleteBook(id: number) {
    this.bookService.deleteBook(id);
  }

  onToggleBook(id: number) {
    this.bookService.toggleBook(id);
  }

}
