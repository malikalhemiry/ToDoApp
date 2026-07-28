import { Injectable, Signal, signal } from '@angular/core';
import { Student } from '../../models/student.model';

@Injectable({
    providedIn: 'root'
})

export class StudentService {

    private _students = signal<Student[]>([
        {id: 1, name: 'John Doe', age: 20,grade: 'A', isActive: true},
        {id: 2, name: 'Jane Smith', age: 22,grade: 'A', isActive: true},
        {id: 3, name: 'Michael Johnson', age: 19,grade: 'B', isActive: false}]);

    getStudents(): Signal<Student[]>{
        return this._students.asReadonly();
    }


    addStudent(name: string, age:number,grade:string){
        
        const nextId =
        Math.max(...this._students().map(s => s.id), 0) + 1;
        
        const newStudent: Student ={
            id:nextId,
            name: name,
            age: age,
            grade: grade,
            isActive: true
        } 

        this._students.update(students=> [
            ...students,
            newStudent
        ]);
    }

    editStudent(id: number,name: string, age:number,grade:string){
        this._students.update(students => 
            students.map(student =>student.id ===id
                ? {
                    ...student,
                    name: name,
                    age: age,
                    grade: grade
                } : student
            )
        );
    }


    deleteStudent(id:number){
        this._students.update(students=>
            students.filter(student => student.id !== id)
        );
    }

    toggleActive(id:number){
        this._students.update(students=>
            students.map(student=> student.id === id ?
                {
                    ...student,
                    isActive: !student.isActive
                } : student
            )
        );
    }
    
}
