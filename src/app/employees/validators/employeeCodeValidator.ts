import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { delay, Observable, of } from "rxjs";

export function employeeCodePatternValidator(control: AbstractControl<string>):
    ValidationErrors | null {
    const value = control.value.toUpperCase();
    if (!value) {
        return null
    }
    if(value.startsWith('EMP-')) {
        return null
    }

    return {
        employeeCodeInvalid: true
    };
}

export const employeeCodeExistValidator: AsyncValidatorFn = (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
    const value = control.value.toUpperCase();
    if (!value) {
        return of(null)
    };

    if (value === 'EMP-1100' || value === 'EMP-1200') {
        return of({
            employeeCodeExists: true
        }).pipe(
            delay(1000)
        );
    }

    return of(null).pipe(delay(1000));
};

export function singlePrimaryPhoneValidator(control: AbstractControl<Phone[]>)
    : ValidationErrors | null {
    const phones = control.value;
    const primaryPhones = phones.filter(phone => phone.isPrimary);
    if (primaryPhones.length !== 1) {
        return {
            singlePrimary: true
        }
    }
    return null;
}

export function passwordMatchingValidator(control: AbstractControl):
    ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');

    if (password?.value !== confirm?.value) {
        return {
            requiredMatch: true
        }
    }
    return null;
}

// export function departmentOptionValidator(control: AbstractControl<Department>):
// ValidationErrors | null{
//     const value = control.value;
//     if()
//     return null;
// }
