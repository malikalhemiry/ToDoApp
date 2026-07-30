interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    isActive: boolean;
}

interface CreateBookDto {
    title: string;
    author: string;
    year: number;
}