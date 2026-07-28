export interface Student {
    id: number;
    name: string;
    age: number;
    grade: string;
    isActive: boolean;
}
export interface CreateStudentDto {
    name: string;
    age: number;
    grade: string;
}
export interface UpdateStudentDto {
    id: number;
    name: string;
    age: number;
    grade: string;
}