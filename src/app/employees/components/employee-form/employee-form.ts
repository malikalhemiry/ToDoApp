import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeFormComponent {

  constructor(){
    effect(() => {
      const employee = this.editingEmployee();
      if(employee){
        this.newEmployee = {
          name: employee.name,
          position: employee.position,
          salary: employee.salary
        }
      }
    });
  }

  newEmployee: CreateEmployeeDto = {
    name: '',
    position: '',
    salary: 0
  };
  
  editingEmployee = input<UpdateEmployeeDto | null>(null);

  add = output<CreateEmployeeDto>();

  onSubmit() {
    if(this.newEmployee.name.trim() && this.newEmployee.position.trim() &&
      this.newEmployee.salary > 0){
        this.add.emit(this.newEmployee)
        this.newEmployee = {
           name: '',
           position: '',
           salary: 0
        };
      }
  }


}
