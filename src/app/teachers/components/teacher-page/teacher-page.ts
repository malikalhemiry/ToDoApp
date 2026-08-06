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

  teachers = signal<Teacher[]>([]); 

  editingTeacher = signal<UpdateTeacherDto | null>(null);

  constructor(private teacherService : TeacherService){}
  
  ngOnInit(): void {
   this.teachers = this.teacherService.getTeachers();
  }

  // onShowData() : void {
  //   this.teachers= this.teacherService.getTeachers();
  // } 

  async onAdd(dto: CreateTeacherDto){
     const editing = this.editingTeacher();
     if(editing){
      this.teacherService.editTeacher(editing).subscribe({
        next: () => {
        this.teachers.update(teacher =>
          teacher.map(t=> t.id === editing.id ? 
            {
              ...t,
              name: dto.name,
              subject: dto.subject
            } : t));
        this.editingTeacher.set(null);
        },
        error: err => console.log(err),
        complete: () => console.log(`Teacher with id ${editing.id} Updated successfully.`),
     });
    }
     else
      {
    const result  = await this.teacherService.addTeacher(dto);
    this.teachers.update(currentTeachers => [...currentTeachers, result]);
     }
  }

  onEdit(teacher: Teacher){ 
    this.editingTeacher.set(teacher);
  }

  onDelete(id: string){
    this.teacherService.deleteTeacher(id).subscribe({
      next: () => {
        this.teachers.update(teachers => teachers.filter(x=>x.id !== id));
      },
      error: err => console.log(err),
      complete: () => console.log(`Teacher with id ${id} deleted successfully.`),
    });
  }

  onToggle(id: string){
    this.teacherService.toggleTeacher(id).subscribe({
      next: () =>{
        this.teachers.update(teachers => 
          teachers.map(t=> t.id === id ? {
            ...t,
            isActive: !t.isActive
          } : t));
      },
      error: err => console.log(err),
      complete: () => console.log(`Teacher with id ${id} Activeted successfully.`),
    });
  }
}
