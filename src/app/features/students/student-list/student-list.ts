import { Component, input, output, signal } from '@angular/core';
import { Student } from '../../../models/student.model';
import { StudentItemComponent } from "../student-item/student-item";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-list',
  imports: [StudentItemComponent, CommonModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentListComponent {
  students= input<Student[]>([]);

  edit = output<Student>();
  toggle = output<number>();
  delete = output<number>();

}
