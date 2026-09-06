import { Component, input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
 import type { ColDef } from 'ag-grid-community'

@Component({
  selector: 'app-employee-grid',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './employee-grid.html',
  styleUrl: './employee-grid.css',
})
export class EmployeeGrid {

  employees = input<Employee []>([]);
  defaultColDef: ColDef = {
     sortable: true,
     resizable: true,
     flex:1,
     minWidth:120,
    };
  colDefs : ColDef<Employee>[] = [
    {
      field: 'employeeCode',
      headerName: 'Code',
      hide: true
    },
    {
      field: 'fullName',
      headerName: 'Name',
      sortable: true,
      pinned: 'left'
    },
    {
      field: 'email',
      headerName: 'Email',
      flex:2
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 150,
      valueFormatter: params => params.value == null ? 'N/A' : `${params.value} years`
    },
    {
      field: 'address',
      headerName: 'Address',
      valueGetter: params => {
        const address = params.data?.address;
        return address
        ? `${address.country} - ${address.city} - ${address.street}`
        : '';
      }
    },
    {
      field: 'department',
      headerName: 'Department',
      filter: true
    }
  ];
}
