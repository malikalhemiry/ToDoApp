import { Component, input, output } from '@angular/core';
import { Student } from '../../../models/student.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-item',
  imports: [CommonModule],
  templateUrl: './student-item.html',
  styleUrl: './student-item.css',
})
export class StudentItemComponent {
  student = input.required<Student>();
  edit = output<Student>();
  toggle = output<number>();
  delete = output<number>();
}
