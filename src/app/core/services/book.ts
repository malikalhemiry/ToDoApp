import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookService {

    books = signal<Book[]>([
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925,isActive: true },
        { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960,isActive: true },
        { id: 3, title: '1984', author: 'George Orwell', year: 1949,isActive: true },
    ]);

    getBooks(): Signal<Book[]> {
        return this.books.asReadonly();
    }

    addBook(title: string, author: string, year: number): void {
        const nextId =
        Math.max(...this.books().map(b => b.id), 0) + 1;

        const newBook = {
            id: nextId,
            title: title,
            author: author,
            year: year,
            isActive: true
        };
        this.books.update(currentBooks =>
             [...currentBooks, newBook]);
    }
    
    editBook(id: number, title: string, author: string, year: number): void {
        this.books.update((currentBooks) =>
            currentBooks.map(book =>
                book.id === id ? 
                { ...book, 
                    title:title,
                    author:author, 
                    year:year } : book
            )
        );
    }

    deleteBook(id: number): void {
        this.books.update((currentBooks) =>
            currentBooks.filter((book) => book.id !== id)
        );
    }

    toggleBook(id: number): void {
        this.books.update((currentBooks) =>
            currentBooks.map((book) =>
                book.id === id ? { ...book, isActive: !book.isActive } : book
            )
        );
    }

}
