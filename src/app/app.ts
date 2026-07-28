import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './core/services/task';
import { TaskFormComponent } from './features/tasks/components/task-form.component/task-form.component';
import { TaskListComponent } from './features/tasks/components/task-list.component/task-list.component';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskListComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService){ }

  ngOnInit() {
    // الاشتراك في الخدمة لاستقبال التحديثات لحظياً
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  onAddTask( title: string){
    this.taskService.addTask( title);
  }

  onToggleTask(id: number){
    this.taskService.toggleTask(id);
  }

  onDeleteTask(id: number){
    this.taskService.deleteTask(id);
  }
}
