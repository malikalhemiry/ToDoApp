import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-teacher-item',
  imports: [],
  templateUrl: './teacher-item.html',
  styleUrl: './teacher-item.css',
})
export class TeacherItem {

  teacher = input.required<Teacher>();

  edit = output<Teacher>();
  delete = output<string>();
  toggle = output<string>();
  
}
