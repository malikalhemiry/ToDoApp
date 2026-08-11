import { Component, output, Signal, signal } from '@angular/core';
import { EmployeeForm } from "../employee-form/employee-form";
import { EmployeeList } from "../employee-list/employee-list";
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-page',
  imports: [EmployeeForm, EmployeeList],
  templateUrl: './employee-page.html',
  styleUrl: './employee-page.css',
})
export class EmployeePage {

  _employees!:Signal<Employee[]>;
  editingEmployee = signal<Employee | null>(null);

  constructor(private _service: EmployeeService){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
   this._employees = this._service.getEmployees();
  }

  onSave(emp: Employee){
    const editing = this.editingEmployee();
    if(editing){
    this._service.editEmployee(emp)
    this.editingEmployee.set(null);
    }
    else{
    this._service.addEmployee(emp);
    }
  }

  onEdit(emp: Employee){
    this.editingEmployee.set(emp);
  }
  onDelete(emp: Employee){
    this._service.deleteEmployee(emp.employeeCode);
  }
}
