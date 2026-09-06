import { inject, Service } from '@angular/core';
import { EmployeeService } from '../Services/employee';

@Service()
export class EmployeeFacade {

    _service = inject(EmployeeService);



    
}
