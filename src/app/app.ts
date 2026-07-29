import { Component, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './core/services/task';
import { TaskFormComponent } from './features/tasks/components/task-form.component/task-form.component';
import { TaskListComponent } from './features/tasks/components/task-list.component/task-list.component';
import { Task } from './models/task.model';
import { CreateStudentDto, Student } from './models/student.model';
import { StudentService } from './core/services/student';
import { StudentFormComponent } from "./features/students/student-form/student-form";
import { StudentListComponent } from "./features/students/student-list/student-list";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskListComponent, StudentFormComponent, StudentListComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  tasks: Task[] = [];
  students!: Signal<Student[]>;

  constructor(private taskService: TaskService, private studentService: StudentService){ }

  ngOnInit() {
    // الاشتراك في الخدمة لاستقبال التحديثات لحظياً
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });

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

    } else {

        this.studentService.addStudent(
            dto.name!,
            dto.age!,
            dto.grade!
        );

    }
  }
  
  onEditStudent(student: Student){
    // this.studentService.editStudent(student.id,student.name,student.age,student.grade);
    
    this.editingStudent.set(student);
  }
  onToggleStudent(id: number){
    this.studentService.toggleActive(id);
  }
  onDeleteStudent(id: number){
    this.studentService.deleteStudent(id);
  }


  onAddTask( title: string){
    this.taskService.addTask( title);
  }

  onToggleTask(id: number){
    this.taskService.toggleTask(id);
  }

  onDeleteTask(id: number){
    this.taskService.deleteTask(id);
  }
}
