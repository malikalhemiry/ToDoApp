import { Injectable, Service, signal, Signal } from '@angular/core';
import { isActive } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

    private _teachers = signal<Teacher[]> ([
        { id: 1, name: 'John Doe', subject: 'Mathematics', isActive: true },
        { id: 2, name: 'Jane Smith', subject: 'Science', isActive: true },
        { id: 3, name: 'Emily Johnson', subject: 'History', isActive: true },
    ]);


    getTeachers(): Signal<Teacher[]> {
          return this._teachers.asReadonly();
    }

    addTeacher(name: string,subject: string){
        const nextId = Math.max(...this._teachers().map(x=>x.id),0) + 1;
        const newTeacher = {
            id: nextId,
            name: name,
            subject: subject,
            isActive: true
        }

        this._teachers.update(currentteachrers =>[ ...currentteachrers, newTeacher]);
    }

    editTeacher(id: number,name: string,subject: string){
        this._teachers.update(teachers=>
            teachers.map(teacher=>
                teacher.id === id ?
                {
                    ...teacher,
                    name: name,
                    subject: subject
                } : teacher
            )
        );
    }

    deleteTeacher(id: number){
         this._teachers.update(teachers =>
            teachers.filter(teacher =>  teacher.id !== id ));
    }

    toggleTeacher(id: number): void{
        this._teachers.update(teachers=>
            teachers.map(teacher => 
                teacher.id === id ?
                {
                    ...teacher,
                    isActive: !teacher.isActive
                } : teacher
            )
        );
    }


}
