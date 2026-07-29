import { Routes } from '@angular/router';
import { StudentPageComponent } from './pages/student-page/student-page';
import { TaskPageComponent } from './pages/task-page/task-page';
import { BookPageComponent } from './pages/book-page/book-page';

export const routes: Routes = [
     {
        path: '',
        redirectTo: 'students',
        pathMatch: 'full'
    },

    {
        path: 'students',
        component: StudentPageComponent
    },

    {
        path: 'tasks',
        component: TaskPageComponent
    },

    {
        path: 'books',
        component: BookPageComponent
    }
];
