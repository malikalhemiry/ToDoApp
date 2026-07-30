import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateStudentDto, Student } from '../../../models/student.model';

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
   
   student = input<Student | null>(null);
   add = output<CreateStudentDto>();
   constructor(){

    effect(() => {

        const student = this.student();

        if(student){

            this.newStudent = {

                name: student.name,

                age: student.age,

                grade: student.grade

            };

        }

    });

}
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
