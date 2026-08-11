import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { minAge, minDate, minPhonesValidator, singlePrimaryPhoneValidator } from '../../Validators/customeValid';

@Component({
  selector: 'app-appointment-form',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm {

  appointmentForm = new FormGroup({
    patientName: new FormControl('',[Validators.required,Validators.minLength(5)]),
    email: new FormControl('',[Validators.required,Validators.email]),
    age: new FormControl<number|undefined>(undefined,[Validators.required, minAge]),
    appointmentType: new FormControl<AppointmentTypes>('Consultation',[Validators.required]),
    appointmentDate: new FormControl<Date>(new Date(),[Validators.required, minDate]),
    needCompanion: new FormControl<boolean>(false),
    companionName: new FormControl<string>(''),
    phones: new FormArray([this.createPhoneForm()],[singlePrimaryPhoneValidator,minPhonesValidator])
  })

  ngOnInit(): void {
    if(this.appointmentForm.controls.needCompanion.value === false){
    this.appointmentForm.controls.companionName.disable();
    }
    
  }
   onSubmit(){
    if(this.appointmentForm.invalid){
      this.appointmentForm.markAllAsTouched();
    }
    else{
      console.log(this.appointmentForm.value);
      this.appointmentForm.reset({
        patientName:'',
        email: '',
        appointmentType: 'Consultation',
        appointmentDate: new Date(),
        needCompanion: false,
      });
      this.phones.clear();
      this.phones.push(this.createPhoneForm());
    }
  }

  createPhoneForm(){
    return new FormGroup({
      number: new FormControl<number|null>(null,[Validators.required, Validators.pattern(/^77\d{7}$/)]),
      type: new FormControl<PhoneTypes>('Mobile',[Validators.required]),
      isPrimary: new FormControl<boolean>(false)
    })
  }

  get phones(){
    return this.appointmentForm.controls.phones;
  }

  addPhone(){
    this.phones.push(this.createPhoneForm());
  }

  removePhone(index: number){
    this.phones.removeAt(index);
  }

  onIsPrimaryChange(index: number){
    this.phones.controls.forEach((phone,i)=>{
      if(i!== index){
        phone.get('isPrimary')?.setValue(false);
      }
    })
  }

  onNeedCompanionChange(){
    const needCompanion = this.appointmentForm.controls.needCompanion.value;
    if(needCompanion){
      this.appointmentForm.controls.companionName.enable();
      this.appointmentForm.controls.companionName.addValidators([Validators.required]);
      this.appointmentForm.controls.companionName.updateValueAndValidity();
    }
    else{
      this.appointmentForm.controls.companionName.disable();
      this.appointmentForm.controls.companionName.removeValidators([Validators.required]);
      this.appointmentForm.controls.companionName.updateValueAndValidity();
    }
  }

 

}
