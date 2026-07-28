import { Component, EventEmitter, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  newTaskTitle: string = '';
  add = output<string>();

  onSubmit() {
    if (this.newTaskTitle.trim()) {
      this.add.emit(this.newTaskTitle.trim());
      this.newTaskTitle = ''; // تفريغ الحقل بعد الإضافة
    }
  }
}
