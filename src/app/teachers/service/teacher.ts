import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, signal, Signal } from '@angular/core';
import { isActive } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { TeacherPage } from '../model/TeacherPage';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

    private _client = inject(HttpClient);
    
    getTeachers() {
          return lastValueFrom(this._client.get<Teacher[]>('https://localhost:7188/teacher/'));
    }
    getPagenationTeachers(page: number, pageSize: number) {
        return lastValueFrom(
            this._client.get<TeacherPage<Teacher>>(`https://localhost:7188/teacher?page=${page}&pageSize=${pageSize}`));
        }

    getTeacher(id: string) {
          return lastValueFrom(this._client.get<Teacher[]>(`https://localhost:7188/teacher/byid/${id}`));
    }

    addTeacher(dto: CreateTeacherDto){
        return firstValueFrom(this._client.post<Teacher>('https://localhost:7188/teacher/',dto));
    }

    editTeacher(dto: UpdateTeacherDto){
        return firstValueFrom(this._client.put<Teacher>(`https://localhost:7188/teacher/`,dto));
    }

    deleteTeacher(id: string){
        return firstValueFrom(this._client.delete(`https://localhost:7188/teacher/${id}`));
    }

    toggleTeacher(id: string){
        return firstValueFrom(this._client.post<Teacher>(`https://localhost:7188/teacher/toggle/${id}`, null));
    }


}
