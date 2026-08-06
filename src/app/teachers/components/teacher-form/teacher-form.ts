
import { Component, effect, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-form',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './teacher-form.html',
  styleUrl: './teacher-form.css',
})
export class TeacherForm {
   constructor() {
    effect(()=>{
      const teacher = this.teacher();
      if(teacher){
        this.newTeacher = {
          name: teacher.name,
          subject: teacher.subject
        }
      }
    })
  }

  newTeacher: CreateTeacherDto = {
    name: '',
    subject: ''
  };

  teacher = input<UpdateTeacherDto | null>(null);

  add = output<CreateTeacherDto>();
  
  onSubmit(){ 
    if(this.newTeacher.name.trim() && this.newTeacher.subject.trim()){
      this.add.emit(this.newTeacher);
      this.newTeacher =  {
         name: '',
         subject: ''
        };
    }
    console.log(this.newTeacher);
  }
}
