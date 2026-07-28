import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {


    private taskSubject = new BehaviorSubject<Task[]>([
        {id: 1, title: 'Math', completed: false},
        {id: 2, title: 'English language', completed: true},
        {id: 3, title: 'Arabic language', completed: false},
    ]);

    getTasks(){
        return this.taskSubject.asObservable();
    }

    addTask(title: string){
        const currentTasks = this.taskSubject.value;
        const newId = currentTasks.length +1;
        const newTask: Task ={
            id: newId,
            title: title,
            completed: false
        };

        this.taskSubject.next([...currentTasks,newTask]);
    }

    deleteTask(id:number){
        const currentTasks = this.taskSubject.value;
        const updateTasks = currentTasks.filter(x=>x.id !== id);

        this.taskSubject.next(updateTasks);
    }

    toggleTask(id: number){
        const currentTasks = this.taskSubject.value;
        const updateTasks = currentTasks.map(task => 
            task.id === id ? { ...task, completed : !task.completed} : task);
        
        this.taskSubject.next(updateTasks);
    }
}
