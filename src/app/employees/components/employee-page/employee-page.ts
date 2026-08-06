import { Component, output, signal, Signal } from '@angular/core';
import { EmployeeService } from '../../service/employee';
import { FormsModule } from '@angular/forms';
import { EmployeeFormComponent } from "../employee-form/employee-form";
import { EmployeeListComponent } from "../employee-list/employee-list";

@Component({
  selector: 'app-employee-page',
  imports: [FormsModule, EmployeeFormComponent, EmployeeListComponent],
  standalone: true,
  templateUrl: './employee-page.html',
  styleUrl: './employee-page.css',
})
export class EmployeePageComponent {
  
  constructor(private empService: EmployeeService){}
  employees!: Signal<Employee[]>;

  editingEmp = signal<UpdateEmployeeDto | null>(null);

  ngOnInit(): void {
    this.employees = this.empService.getEmployees();
  }

  onAdd(dto: CreateEmployeeDto){
    const editing = this.editingEmp();
    if(editing){
      this.empService.editEmployee(editing);
    }
    this.empService.addEmployee(dto);
  }

  onEdit(emp: Employee){
    this.editingEmp.set({
      id: emp.id,
      name: emp.name,
      position: emp.position,
      salary: emp.salary
    });
  }

  onDelete(id: number){
    this.empService.deleteEmployee(id);
  }

  onToggle(id: number){
    this.empService.toggleActive(id);
  }
}
