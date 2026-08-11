import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-employee-item',
  imports: [],
  standalone:true,
  templateUrl: './employee-item.html',
  styleUrl: './employee-item.css',
})
export class EmployeeItem {
  employee = input.required<Employee>();
  edit = output<Employee>();
  delete = output<Employee>();
}
