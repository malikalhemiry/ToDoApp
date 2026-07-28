import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { Task } from '../../../../models/task.model';
import { TaskItemComponent } from '../task-item.component/task-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent], // نستورد مكون العنصر هنا
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  tasks = input<Task[]>([]);
   
  toggle = output<number>();
   
  delete = output<number>();
}