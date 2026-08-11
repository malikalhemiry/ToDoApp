import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { employeeCodeValidator, isEmp, minPhonesValidator, passwordMatchValidator, singlePrimaryPhoneValidator } from '../../custom-validators/minThreeCharactes';

@Component({
  selector: 'app-reactive-form',
  imports: [ReactiveFormsModule, JsonPipe],
  standalone: true,
  templateUrl: './reactive-form.html',
  styleUrl: './reactive-form.css',
})
export class ReactiveFormComponent {
  userForm = new FormGroup({

    fullName: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [employeeCodeValidator]
    }),

    email: new FormControl('',
    [
      Validators.email,
      Validators.required,
      Validators.minLength(7),
    ]),

    age: new FormControl(undefined,
      [Validators.required]),

    password: new FormControl('',
      [Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]), 

    passwordConfirmation: new FormControl('',
      [Validators.required]),

    improve: new FormControl(false, [Validators.requiredTrue]),
    // phones: new FormArray<FormControl<number|null>>([]) 
    phones: new FormArray<FormGroup>([
      this.createPhoneForm()
    ], [
      minPhonesValidator(1), 
      singlePrimaryPhoneValidator
     ])
  },
[
  passwordMatchValidator
]);

get phones(){
  return this.userForm.controls.phones;
}
addPhone(){
  this.phones.push(this.createPhoneForm());
}

deletePhone(index: number){
  this.phones.removeAt(index);
}

private createPhoneForm(){

    return new FormGroup({
        number: new FormControl('', [
          Validators.required,
          Validators.pattern(/^7\d{8}$/)
        ]),
        type: new FormControl('', [Validators.required]),
        isPrimary: new FormControl(false)

    });

}

  get fullName(){
    return this.userForm.controls.fullName;
  }

  get email(){
   return this.userForm.controls.email;
  }

  get age(){
   return this.userForm.controls.age;
  }

  get password(){
   return this.userForm.controls.password;
  }

  get passwordConfirmation(){
   return this.userForm.controls.passwordConfirmation;
  }
  
  get improve(){
   return this.userForm.controls.improve;
  }

  onSubmit(){
    console.log(this.userForm.value);
    this.userForm.reset({
      fullName: '',
      email: '',
      age: undefined,
      improve: false,
    });
    this.phones.clear();
    this.phones.push(this.createPhoneForm());
  }
  
  onPrimaryChange(index: number){
    this.phones.controls.forEach((phone,i)=>{
      if(i !== index){
      phone.get('isPrimary')?.setValue(false);
      }
    });
  }
  
}
