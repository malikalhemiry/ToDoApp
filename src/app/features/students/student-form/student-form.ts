import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateStudentDto } from '../../../models/student.model';

@Component({
  selector: 'app-student-form',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './student-form.html',
  styleUrl: './student-form.css', 
})
export class StudentFormComponent {
   newStudent : CreateStudentDto = {
    name: '',
    age: 0,
    grade: ''
   };

   add = output<CreateStudentDto>();

   onSubmit(){
    if (
    this.newStudent.name?.trim() &&
    this.newStudent.age &&
    this.newStudent.grade?.trim())
    {
      this.add.emit(this.newStudent);
      this.newStudent = {
         name: '',
         age: 0,
         grade: ''
        };
    }
   }
}
