import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../../../../shared/components/button/button';
import { strongPasswordValidator } from '../../../../shared/validators/password-validator';
import { confirmPasswordValidator } from '../../../../shared/validators/confirm-password-validator';
import { phoneValidator } from '../../../../shared/validators/phone-validator';
import { RegisterRequest } from '../../models/register.model';
import { AuthFacade } from '../../fascade/auth.fascade';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Button,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  providers: [AuthService]
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  showPassword: boolean = false;
  showConfirm: boolean = false;
  
  
  constructor(private fb:FormBuilder, private authFacade: AuthFacade
  ) {
    this.formInitilize();
  }

  formInitilize(){
    this.registerForm=this.fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      username:['',Validators.required],
      email:['',[Validators.required ,Validators.email]],
      phone:['',[Validators.required,phoneValidator()]],
      password:['',[Validators.required , strongPasswordValidator()]],
      confirmPassword:['',Validators.required]
    },{
    validators: confirmPasswordValidator
  })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm() {
    this.showConfirm = !this.showConfirm;
  }

  onRegister() {
    const payload: RegisterRequest = this.registerForm.value as RegisterRequest;  
    payload.role = 1; // Default role as User
    this.authFacade.register(payload);
  }
  
}