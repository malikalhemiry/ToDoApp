import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-employee-item',
  imports: [],
  standalone: true,
  templateUrl: './employee-item.html',
  styleUrl: './employee-item.css',
})
export class EmployeeItemComponent {

  employee = input.required<Employee>();

  edit = output<Employee>();
  delete = output<number>();
  toggle = output<number>();

}
