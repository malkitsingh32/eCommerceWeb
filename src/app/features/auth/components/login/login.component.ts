import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Button } from '../../../../shared/components/button/button';
import { AuthFacade } from '../../fascade/auth.fascade';
import { strongPasswordValidator } from '../../../../shared/validators/password-validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  remember = false;
  loading = false;
  error = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private authfascade: AuthFacade, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator()]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.authfascade.login(this.loginForm.value);
  }
}