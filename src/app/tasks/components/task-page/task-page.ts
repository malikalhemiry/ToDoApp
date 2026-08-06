import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { Task } from '../../model/task.model';
import { HttpClient } from '@angular/common/http';
import { TaskFormComponent } from '../task-form.component/task-form.component';
import { TaskListComponent } from '../task-list.component/task-list.component';
import { TaskService } from '../../Service/task';

@Component({
  selector: 'app-task-page',
  imports: [TaskListComponent, TaskFormComponent],
  templateUrl: './task-page.html',
  styleUrl: './task-page.css',
})
export class TaskPageComponent implements OnInit {
  
  tasks = signal<Task[]> ([]);
  
  constructor(private taskService: TaskService){ }

  client = inject(HttpClient)
  
  async ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks.set(tasks);
    });
  }

  async onAddTask( title: string){
    const result =await this.taskService.addTask(title);
    this.tasks.update(currentTasks => [...currentTasks, result]);
  }

  onToggleTask(id: string){
    this.taskService.toggleTask(id).subscribe({
      next: () =>{
        this.tasks.update(currentTasks => 
          currentTasks.map(x=>x.id === id ? 
            {
              ...x,
              isComplete: !x.isComplete
            } : x ));
      },
      error: err => {
        console.error(err);
         this.taskService.getTasks().subscribe(tasks => {
          this.tasks.set(tasks);
        });
      },
      complete: () => console.log(`Task with id ${id} deleted successfully.`),
    });
  }
  
  onDeleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
    next: () => {
      this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    },
    error: err => console.error(err),

    complete: () => console.log(`Task with id ${id} deleted successfully.`),
    
  });
}

}
