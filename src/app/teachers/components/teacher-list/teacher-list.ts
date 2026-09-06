import { Component, input, output } from '@angular/core';
import { TeacherForm } from "../teacher-form/teacher-form";
import { TeacherItem } from "../teacher-item/teacher-item";
import { TeacherPage } from '../../model/TeacherPage';

@Component({
  selector: 'app-teacher-list',
  imports: [ TeacherItem],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.css',
})
export class TeacherList {
  teachers = input<Teacher[]>([])

  edit = output<Teacher>();
  delete = output<string>();
  toggle = output<string>();
}
