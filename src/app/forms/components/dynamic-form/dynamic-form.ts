import { Component } from '@angular/core';
import { FormControl, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '../../models/form-field';

@Component({
  selector: 'app-dynamic-form',
  imports: [ReactiveFormsModule],
  standalone: true,                               
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
})
export class DynamicForm {
  form = new FormGroup({});
  fields: FormField[] = [

    {
      type: 'text',
      name: 'name',
      label: 'Name',
      required: true
    },

    {
      type: 'email',
      name: 'email',
      label: 'Email'
    },

    {
      type: 'number',
      name: 'age',
      label: 'Age'
    },

    {
      type: 'select',
      name: 'country',
      label: 'Country',
      options: [
        'Yemen',
        'Saudi',
        'Egypt'
      ]
    },

    {
      type: 'checkbox',
      name: 'accept',
      label: 'Accept Terms'
    }
];

    ngOnInit() {

    for (const field of this.fields) {
      this.form.addControl(
        field.name,
        new FormControl(field.value ?? '', field.required  ? Validators.required : [])
      );
    }

  }

   submit() {

    console.log(this.form.value);

  }

}
