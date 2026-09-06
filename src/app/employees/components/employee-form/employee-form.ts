import { Component, effect, input, OnInit, output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { employeeCodeExistValidator, employeeCodePatternValidator, passwordMatchingValidator, singlePrimaryPhoneValidator } from '../../validators/employeeCodeValidator';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, JsonPipe],
  standalone: true,
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm{

  editingEmployee = input<Employee| null>(null);

  add = output<Employee>();
  
  constructor(){
    effect(()=>{
      const editing = this.editingEmployee();
      if(editing){
        this.empForm.patchValue({
          employeeCode: editing.employeeCode,
          fullName: editing.fullName,
          email: editing.email,
          age:  editing.age,
          position: editing.position,
          department:editing.department,
          password: editing.password,
          confirmPassword:editing.confirmPassword,
          address: editing.address
        });
        
        this.phones.clear();
        editing.phones.forEach((phone)=>{
          this.phones.push(this.createPhoneForm(phone))
        });
        
        this.skills.clear();
        editing.skills.forEach((skill)=>{
          this.skills.push(this.createSkillForm(skill))
        });
      }
      else{
        this.empForm.reset();

        this.phones.clear();
        this.skills.clear();

        this.phones.push(this.createPhoneForm())
        this.skills.push(this.createSkillForm())
      }
    })
  }

  

  onSubmit() {

    if (this.empForm.invalid) {
       this.empForm.markAllAsTouched();
       return;
      }

      this.add.emit(this.empForm.getRawValue());
      this.empForm.reset();
      this.phones.clear();
      this.skills.clear();
      this.phones.push(this.createPhoneForm());
      this.skills.push(this.createSkillForm());
      
  }

  empForm = new FormGroup({
    employeeCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, employeeCodePatternValidator],
      asyncValidators: [employeeCodeExistValidator]
    }),
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    age: new FormControl<number | null>(null, [Validators.min(18), Validators.max(65)]),
    department: new FormControl<Department>('HR',{
      nonNullable: true,
      validators:  [Validators.required]
    }),
    position: new FormControl<Position>('HR Specialist', {
      nonNullable: true,
      validators:  [Validators.required]
    }),
    address: this.createAddressForm(),
    phones: new FormArray([this.createPhoneForm()], [singlePrimaryPhoneValidator]),
    skills: new FormArray([this.createSkillForm()]),
    password: new FormControl<string>('', {
      nonNullable:true,
      validators: [Validators.required]
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable:true,
      validators: [Validators.required]
    })
  },
    [passwordMatchingValidator]);

  createAddressForm() {
    return new FormGroup({
      country: new FormControl<string>('', {
      nonNullable: true,
      validators:  [Validators.required]
    }),
      city: new FormControl<string>('', {
      nonNullable: true,
      validators:  [Validators.required]
    }),
      street: new FormControl<string>('', {
      nonNullable: true,
      validators:  [Validators.required]
    }),
      postalCode: new FormControl<string>('', {
      nonNullable: true,
      validators:  [Validators.required]
    }),
    })
  }

  get address(){
    return this.empForm.controls.address;
  }

  createPhoneForm(phone?: Phone) 
  {
    return new FormGroup({
      number: new FormControl<string>(phone?.number ?? '',{
      nonNullable: true,
      validators:  [Validators.required,
          Validators.pattern(/^77\d{7}$/)]
    }),
      type: new FormControl<PhoneType>(phone?.type ?? 'Mobile', {
      nonNullable: true,
      validators:  [Validators.required]
    }),
      isPrimary: new FormControl<boolean>(phone?.isPrimary ?? false,{
        nonNullable:true
      })
    })
  }

  get phones() {
    return this.empForm.controls.phones;
  }

  addPhone() {
    this.phones.push(this.createPhoneForm());
  }

  removePhone(index: number) {
    if (this.phones.length === 1) {
      return;
    }

    this.phones.removeAt(index);
  }

  onPrimaryPhoneChange(index: number) {
    this.phones.controls.forEach((phone, i) => {
      if (i !== index) {
        phone.controls.isPrimary.setValue(false);
      }
    })
  }


  createSkillForm(skill?: Skill) 
  {
    return new FormGroup({
      name: new FormControl<string>(skill?.name ?? '', {
          nonNullable: true,
          validators:[Validators.required, Validators.minLength(2)]
        }),
        level: new FormControl<SkillLevel>(skill?.level ?? 'Beginner',{
             nonNullable: true,
             validators: [ Validators.required]
            }),
            years: new FormControl<number>(skill?.years ?? 0,{
                nonNullable: true,
                validators: [
                     Validators.required,
                     Validators.min(0),
                     Validators.max(50)
                    ]
                  })
                })
    }

  get skills() {
    return this.empForm.controls.skills;
  }

  addSkill() {
    this.skills.push(this.createSkillForm())
  }

  deleteSkill(index: number) {
    this.skills.removeAt(index);
  }


  get employeeCode(){
    return this.empForm.controls.employeeCode;
  }
  get fullName(){
    return this.empForm.controls.fullName;
  }
  get email(){
    return this.empForm.controls.email;
  }
  get age(){
    return this.empForm.controls.age;
  }
  get department(){
    return this.empForm.controls.department;
  }
  get position(){
    return this.empForm.controls.position;
  }

  get password(){
    return this.empForm.controls.password;
  }
  get confirmPassword(){
    return this.empForm.controls.confirmPassword;
  }

}
