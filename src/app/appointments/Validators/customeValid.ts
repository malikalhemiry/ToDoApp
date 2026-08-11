import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { delay, Observable, of } from "rxjs";

export function minAge(control: AbstractControl<number| undefined>): ValidationErrors | null{
    const age = control.value; 
    if(age === undefined){
        return null;
    }

    if(age < 18){
        return {
            ageSmall: age
        }
    }

    return null;
}

export function minDate(contorl: AbstractControl<Date>): ValidationErrors | null{
    const date = contorl.value;
    if(date.toLocaleDateString('en-GB') < new Date().toLocaleDateString('en-GB')){
        return{
            invalidPastDate: date
        };
    }

    return null;
}

export function minPhonesValidator(control: AbstractControl): ValidationErrors | null{
    const phones = control.value;
    if(phones.length < 1){
        return{
            minPhone: phones.length
        }
    }

    return null;
}

export function singlePrimaryPhoneValidator(control: AbstractControl): ValidationErrors | null{
        const phones = control.value;
        const primaryPhones = phones.filter(
            (phone: any)=>phone.isPrimary === true);
            if(primaryPhones.length === 1){
                return null
            }

        return {
                    multiplePrimaryPhones: true
                }
    }
    