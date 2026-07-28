import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent {

  task = input.required<Task>();

  toggle = output<number>();

  delete = output<number>();

}