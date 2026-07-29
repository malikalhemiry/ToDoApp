import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../core/services/task';
import { TaskListComponent } from "../../features/tasks/components/task-list.component/task-list.component";
import { TaskFormComponent } from "../../features/tasks/components/task-form.component/task-form.component";

@Component({
  selector: 'app-task-page',
  imports: [TaskListComponent, TaskFormComponent],
  templateUrl: './task-page.html',
  styleUrl: './task-page.css',
})
export class TaskPageComponent implements OnInit {
  
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
