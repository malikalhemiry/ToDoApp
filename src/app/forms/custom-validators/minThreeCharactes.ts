import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { delay, Observable, of } from "rxjs";

export function isEmp(control:AbstractControl<string|null>): ValidationErrors | null{
    const value = control.value?.toUpperCase();
    
    if(!value){
        return null;
    }

    if(value.startsWith('EMP-')){
        return null;
    }
    return{
        invalidEmployeeCode: true
    };
}


export function passwordMatchValidator(control: AbstractControl):
ValidationErrors | null{
    const password = control.get('password');
    const confirm = control.get('passwordConfirmation')

    if(password?.value === confirm?.value){
        return null;
    }

    return {
         passwordMismatch: true
    }
}

export function minPhonesValidator(min: number){
return (control: AbstractControl): ValidationErrors | null =>{
    const phones = control.value;

    if(phones.length < min){
        return {
            minPhones:{required: min,actual: phones.length}
        }
    };
    return null;
};
}

export function singlePrimaryPhoneValidator(
  control: AbstractControl
): ValidationErrors | null {

  const phones = control.value;

  const primaryPhones = phones.filter(
    (phone: any) => phone.isPrimary === true
  );

  if (primaryPhones.length != 1) {

    return {
      multiplePrimaryPhones: true
    };

  }

  return null;
}

export const employeeCodeValidator : AsyncValidatorFn = (control: AbstractControl<string| null>): Observable<ValidationErrors|null> => 
        {
            const value = control.value?.toUpperCase();
            if(!value){
                return of(null)
            }
            if(value.startsWith('EMP-')){
                return of({
                    employeeCodeExists: true
                }).pipe(
                    delay(1000)
                );
            }
            
        return of(null).pipe(delay(1000));
     }
