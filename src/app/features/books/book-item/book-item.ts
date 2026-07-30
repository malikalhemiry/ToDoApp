import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-book-item',
  imports: [],
  templateUrl: './book-item.html',
  styleUrl: './book-item.css',
})
export class BookItemComponent {
book =input.required<Book>();
edit = output<Book>();
delete = output<number>();
toggle = output<number>();

}
