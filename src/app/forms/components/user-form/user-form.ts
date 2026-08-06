import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule,JsonPipe],
  standalone: true,
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {

  userData : UserFormData = {
    fullName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    age: undefined,
    improve: false,
  };

  onSubmit() {
    console.log('User Data:', this.userData);
  }
}
