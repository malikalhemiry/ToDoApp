import { Component, OnInit, signal, Signal } from '@angular/core';
import { StudentFormComponent } from "../../features/students/student-form/student-form";
import { StudentListComponent } from "../../features/students/student-list/student-list";
import { CreateStudentDto, Student } from '../../models/student.model';
import { StudentService } from '../../core/services/student';

@Component({
  selector: 'app-student-page',
  imports: [StudentFormComponent, StudentListComponent],
  templateUrl: './student-page.html',
  styleUrl: './student-page.css',
})
export class StudentPageComponent implements OnInit {
  
  students!: Signal<Student[]>;

  constructor(private studentService: StudentService){ }
  ngOnInit(): void {
    
    this.students = this.studentService.getStudents();
  }
  
  editingStudent = signal<Student | null>(null);
  onAddStudent(dto: CreateStudentDto){
      const editing = this.editingStudent();
       if (editing) {
          this.studentService.editStudent(
              editing.id,
              dto.name!,
              dto.age!,
              dto.grade!
          );
  
          this.editingStudent.set(null);
  
      } 
      else 
        {
  
          this.studentService.addStudent(
              dto.name!,
              dto.age!,
              dto.grade!
          );
  
      }
    }
    
  onEditStudent(student: Student){
    this.editingStudent.set(student);
  }
  onToggleStudent(id: number){
    this.studentService.toggleActive(id);
  }
  onDeleteStudent(id: number){
    this.studentService.deleteStudent(id);
  }

}
