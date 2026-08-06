import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Task } from '../../tasks/model/task.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TaskService {


    private _client = inject(HttpClient);

    getTasks(){
        return this._client.get<Task[]>('https://localhost:7188/todos/');
    }

    
      async addTask(title: string){
         const result = await firstValueFrom(
            this._client.post<Task>('https://localhost:7188/todos/', {title}));
            console.log('Task added:', result);
         return result;
      }
    
    deleteTask(id:string){
        return this._client.delete(`https://localhost:7188/todos/${id}`);
    }
    
    toggleTask(id: string){
        const result = this._client.post<Task>(`https://localhost:7188/todos/toggle/${id}`,null);
        return result;
    }
}
