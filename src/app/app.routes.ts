import { Routes } from '@angular/router';
import { StudentPageComponent } from './pages/student-page/student-page';
import { TaskPageComponent } from './tasks/components/task-page/task-page';
import { BookPageComponent } from './pages/book-page/book-page';
import { TeacherPageComponent } from './teachers/components/teacher-page/teacher-page';
import { DynamicForm } from './forms/components/dynamic-form/dynamic-form';
import { UserForm } from './forms/components/user-form/user-form';
import { ReactiveFormComponent } from './forms/components/reactive-form/reactive-form';
import { EmployeePage } from './employees/components/employee-page/employee-page';

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
    },

    {
        path: 'teachers',
        component: TeacherPageComponent
    },

    {
        path: 'employees',
        component: EmployeePage
    },
    
    {
        path: 'forms',
        component: DynamicForm
    },
    
    {
        path: 'users',
        component: UserForm
    },
    
    {
        path: 'reactives',
        component: ReactiveFormComponent
    }
];
