import { Component, input, output, signal, Signal } from '@angular/core';
import { EmployeeItem } from "../employee-item/employee-item";

@Component({
  selector: 'app-employee-list',
  imports: [EmployeeItem],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList {
  employees= input<Employee[]>([]);

  edit = output<Employee>();
  delete = output<Employee>();
}
