import { Component, input, output } from '@angular/core';
import { EmployeeItemComponent } from "../employee-item/employee-item";

@Component({
  selector: 'app-employee-list',
  imports: [EmployeeItemComponent],
  standalone: true,
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeListComponent {

  employees = input<Employee []>([]);

  edit = output<Employee>();
  delete = output<number>();
  toggle = output<number>();
}
