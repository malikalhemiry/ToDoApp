import { Component, input, inputBinding, output } from '@angular/core';
import {ColumnDef, FlexRender, flexRenderComponent, injectTable, tableFeatures } from '@tanstack/angular-table';
import { PhoneCell } from '../phone-cell/phone-cell';
import { EmployeeActions } from '../employee-actions/employee-actions';
@Component({
  selector: 'app-employee-table',
  imports: [FlexRender],
  standalone: true,
  templateUrl: './employee-table.html',
  styleUrl: './employee-table.css',
})
export class EmployeeTableComponent {

  features = tableFeatures({
    // sorting
  });

  employees = input<Employee[]>([]);
  
  edit = output<Employee>();
  delete = output<Employee>();

  columns: Array<ColumnDef<typeof this.features,Employee>> = [
    {
      accessorKey: 'employeeCode',
      header: 'Code'
    },
    {
      accessorKey: 'fullName',
      header: 'Full Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: info=> {
        const age = info.getValue<number|null>();
        return age === null ? '-' : `${info.getValue()} years`;
      }
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: info => `[${info.getValue()}]`
    },
    {
      accessorKey: 'position',
      header:'Position'
    },
    {
      id:'country',
      accessorFn: info => info.address.country,
      header: 'Country'
    },
    {
      // id: 'phones',
      accessorKey: 'phones',
      // accessorFn: info => info.phones.map(phone => phone.number),
      header: 'Phones',
      // cell: info => {
      //   const phones = info.getValue<Phone[]>();
      //   return phones.map(phone => `${phone.type}: ${phone.number}`).join(' | ');
      // }
      cell: info => flexRenderComponent(PhoneCell,{
        inputs: {
          phones: info.getValue<Phone[]>()
        }
      })
    },
    {
      accessorKey: 'skills',
      header: 'Skills',
      cell: info => {
        const skills = info.getValue<Skill[]>();
        return skills.map(skill => `${skill.name} - ${skill.level}`).join(' | ');
      },

    },
    {
      accessorKey:'actions',
      header:'Actions',
      cell: info => 
        flexRenderComponent(EmployeeActions,{
          outputs: {
            edit: () => {
              console.log('Edit:', info.row.original);
              this.edit.emit(info.row.original)
            },
            delete: () => {
              console.log('Delete:', info.row.original)
              this.delete.emit(info.row.original)
            }
          }
        })
    }
  ]
















  
  table = injectTable(() => ({
    features: this.features,
    data: this.employees(),
    columns: this.columns,
}));

}
