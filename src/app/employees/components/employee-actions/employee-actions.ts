import { Component, output } from '@angular/core';

@Component({
  selector: 'app-employee-actions',
  imports: [],
  standalone: true,
  templateUrl: './employee-actions.html',
  styleUrl: './employee-actions.css',
})
export class EmployeeActions {
  edit = output<void>();
  delete = output<void>();
}
