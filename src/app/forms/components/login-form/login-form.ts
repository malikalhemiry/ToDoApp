import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginFormComponent {
   loginData: LoginFormData ={
    fullName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    age: undefined,
    improve: false
  }

  onSubmit(){
    console.log(this.loginData);
  }

}
