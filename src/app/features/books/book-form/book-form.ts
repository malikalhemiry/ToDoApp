import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-form',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookFormComponent {
  
  newBook : CreateBookDto = {
    title: '',
    author: '',
    year: 0
  };
  
  book = input<Book | null>(null);
  add = output<CreateBookDto>();

  constructor() {
    effect(()=>{
      const book = this.book();
      if(book){
        this.newBook = {
          title: book.title,
          author: book.author,
          year: book.year
        };
      }
    })
  }

  onSubmit() {
    if(this.newBook.title.trim() && this.newBook.author.trim() && this.newBook.year) {
      this.add.emit(this.newBook);
      this.newBook = {
        title: '',
        author: '',
        year: 0
      };
    }
  }
}
