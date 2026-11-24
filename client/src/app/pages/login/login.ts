
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  showPassword = signal(false);
  submitted = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['nirav@nagarro.com', [Validators.required, Validators.email]],
    password: ['Password123', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  onLogin(): void {
    this.submitted.set(true);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } =
      this.loginForm.getRawValue();

    // Connect your authentication API here.
    console.log({ email, password, rememberMe });

    // Example after successful login:
    this.router.navigate(['/dashboard']);
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }
}
