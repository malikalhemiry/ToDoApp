import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, signal, Signal } from '@angular/core';
import { isActive } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

    private _teachers = signal<Teacher[]> ([]);

    private _client = inject(HttpClient);
    
    getTeachers() {
          const result = this._client.get<Teacher[]>('https://localhost:7188/teacher/').subscribe(teachers=>{
            this._teachers.set(teachers);
          });
          return this._teachers;
    }

    async addTeacher(dto: CreateTeacherDto){
        const result = await firstValueFrom(this._client.post<Teacher>('https://localhost:7188/teacher/',dto));
            console.log('Teacher added:', result);
         return result;
        // const nextId = Math.max(...this._teachers().map(x=>x.id),0) + 1;
        // const newTeacher = {
        //     id: nextId,
        //     name: name,
        //     subject: subject,
        //     isActive: true
        // }

        // this._teachers.update(currentteachrers =>[ ...currentteachrers, newTeacher]);
    }

    editTeacher(dto: UpdateTeacherDto){
        return this._client.put<Teacher>(`https://localhost:7188/teacher/`,dto);
    }

    deleteTeacher(id: string){
        return this._client.delete<Teacher>(`https://localhost:7188/teacher/${id}`);
        //  this._teachers.update(teachers =>
        //     teachers.filter(teacher =>  teacher.id !== id ));
    }

    toggleTeacher(id: string){
        return this._client.post<Teacher>(`https://localhost:7188/teacher/toggle/${id}`, null);
    }


}
