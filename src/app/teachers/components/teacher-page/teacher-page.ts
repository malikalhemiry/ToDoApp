import { Component, OnInit, output, signal, Signal } from '@angular/core';
import { TeacherService } from '../../service/teacher';
import { TeacherForm } from "../teacher-form/teacher-form";
import { TeacherList } from "../teacher-list/teacher-list";

@Component({
  selector: 'app-teacher-page',
  imports: [TeacherForm, TeacherList],
  standalone: true,
  templateUrl: './teacher-page.html',
  styleUrl: './teacher-page.css',
})
export class TeacherPageComponent implements OnInit {

  teachers!: Signal<Teacher[]>;

  editingTeacher = signal<Teacher | null>(null);

  constructor(private teacherService : TeacherService){}
  
  ngOnInit(): void {
    this.teachers = this.teacherService.getTeachers();
  }

  // onShowData() : void {
  //   this.teachers= this.teacherService.getTeachers();
  // } 

  onAdd(dto: CreateTeacherDto){
     const editing = this.editingTeacher();
     if(editing){
      this.teacherService.editTeacher(
        editing.id,
        dto.name,
        dto.subject
      );
     }
     else{
    this.teacherService.addTeacher(
      dto.name,
      dto.subject);
     }
  }

  onEdit(teacher: Teacher){ 
    this.editingTeacher.set(teacher);
  }

  onDelete(id: number){
    this.teacherService.deleteTeacher(id);
  }

  onToggle(id: number){
    this.teacherService.toggleTeacher(id);
  }
}
