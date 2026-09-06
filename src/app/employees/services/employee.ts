import { Injectable, Service, signal } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class EmployeeService {
    private _employees = signal<Employee[]>([
  {
    employeeCode: 'EMP-001',
    fullName: 'Ahmed Mohammed',
    email: 'ahmed.mohammed@example.com',
    age: null,
    department: 'IT',
    position: 'Developer',

    address: {
      country: 'Yemen',
      city: 'Sanaa',
      street: 'Hadda Street',
      postalCode: '12345'
    },

    phones: [
      {
        number: '771234567',
        type: 'Mobile',
        isPrimary: true
      },
      {
        number: '778452083',
        type: 'Work',
        isPrimary: false
      }
    ],

    skills: [
      {
        name: 'Angular',
        level: 'Advanced',
        years: 4
      },
      {
        name: '.NET',
        level: 'Advanced',
        years: 10
      }
    ],

    password: 'Ahmed123',
    confirmPassword: 'Ahmed123'
  },

  {
    employeeCode: 'EMP-002',
    fullName: 'Sara Ali',
    email: 'sara.ali@example.com',
    age: 34,
    department: 'Finance',
    position: 'Accountant',

    address: {
      country: 'Yemen',
      city: 'Aden',
      street: 'Al-Mansoura Street',
      postalCode: '23456'
    },

    phones: [
      {
        number: '733456789',
        type: 'Mobile',
        isPrimary: true
      }
    ],

    skills: [
      {
        name: 'Accounting',
        level: 'Expert',
        years: 8
      }
    ],

    password: 'Sara123',
    confirmPassword: 'Sara123'
  },

  {
    employeeCode: 'EMP-003',
    fullName: 'Mohammed Hassan',
    email: 'mohammed.hassan@example.com',
    age: 41,
    department: 'HR',
    position: 'HR Specialist',

    address: {
      country: 'Yemen',
      city: 'Taiz',
      street: 'Jamol Street',
      postalCode: '34567'
    },

    phones: [
      {
        number: '776789012',
        type: 'Work',
        isPrimary: true
      }
    ],

    skills: [
      {
        name: 'Human Resources',
        level: 'Advanced',
        years: 10
      }
    ],

    password: 'Mohammed123',
    confirmPassword: 'Mohammed123'
  }
]);


getEmployees(){
   return this._employees.asReadonly();
}

addEmployee(emp: Employee){
    this._employees.update(current => [...current , emp]);
}

deleteEmployee(empCode: string){
    this._employees.update(employees=>
        employees.filter(emp=> emp.employeeCode !== empCode)
    );
}

editEmployee(employee: Employee) {
  this._employees.update(employees =>
    employees.map(emp =>
      emp.employeeCode === employee.employeeCode
        ? employee
        : emp
    )
  );
}

}
