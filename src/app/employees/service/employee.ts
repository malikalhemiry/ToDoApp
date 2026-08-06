import { inject, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
    
  private _employees = signal<Employee[]>([
    { id: 1, name: 'John Doe', position: 'Software Engineer', salary: 75000, isActive: true },
    { id: 2, name: 'Jane Smith', position: 'Project Manager', salary: 85000, isActive: true },
    { id: 3, name: 'Alice Johnson', position: 'UX Designer', salary: 70000, isActive: true },
  ]);

  getEmployees(): Signal<Employee[]>{
    return this._employees.asReadonly();
  }

  addEmployee(dto: CreateEmployeeDto): void{
    const nextId =  Math.max(...this._employees().map(x=>x.id),0) + 1;
    const newEmployee : Employee = {
       id: nextId,
       name: dto.name,
       position: dto.position,
       salary: dto.salary,
       isActive: true
   }

   this._employees.update(employees=> [...employees , newEmployee] );
  }

  editEmployee(dto: UpdateEmployeeDto):void{
    this._employees.update(employees=>
      employees.filter(emp=> emp.id === dto.id ? {
        ...emp,
        name: dto.name,
        position: dto.position,
        salary: dto.salary
      } : emp)
    );
  }

  deleteEmployee(id: number): void{
    this._employees.update(employees=>
      employees.filter(employee=> employee.id !== id));
  }

  toggleActive(id: number){
    this._employees.update(employees=>
      employees.map(emp=> 
        emp.id === id ? 
        {
          ...emp,
          isActive: !emp.isActive
        }: emp
      )
    );
  }

}