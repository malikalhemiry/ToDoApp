import { AbstractControl, ValidationErrors } from "@angular/forms";

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

