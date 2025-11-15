import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center text-gray-800">Create an Account</h1>
        <form (ngSubmit)="onRegister()" #registerForm="ngForm">
          <div class="space-y-4">
            <div>
              <label for="name" class="text-sm font-medium text-gray-700">Full Name</label>
              <input id="name" name="name" type="text" required [(ngModel)]="formData.name"
                     class="w-full px-3 py-2 mt-1 border rounded-md">
            </div>
            <div>
              <label for="email" class="text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="email" required [(ngModel)]="formData.email"
                     class="w-full px-3 py-2 mt-1 border rounded-md">
            </div>
            <div>
              <label for="password" class="text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" required [(ngModel)]="formData.password"
                     class="w-full px-3 py-2 mt-1 border rounded-md">
            </div>
            <div>
              <label for="role" class="text-sm font-medium text-gray-700">I am a...</label>
              <select id="role" name="role" [(ngModel)]="formData.role"
                      class="w-full px-3 py-2 mt-1 border rounded-md">
                <option value="buyer">Buyer</option>
                <option value="seller">Seller / Artisan</option>
              </select>
            </div>
          </div>
          <div *ngIf="errorMessage" class="p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-md">
            {{ errorMessage }}
          </div>
          <button type="submit" [disabled]="!registerForm.valid || isLoading"
                  class="w-full px-4 py-2 mt-6 font-semibold text-white bg-green-700 rounded-md disabled:bg-gray-400">
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
        </form>
        <p class="text-sm text-center text-gray-600">
          Already have an account? <a routerLink="/login" class="font-medium text-green-700">Log in</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  formData = {
    name: '',
    email: '',
    password: '',
    role: 'buyer'
  };
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  onRegister() {
    this.isLoading = true;
    this.errorMessage = null;
    this.api.register(this.formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.msg || 'Registration failed.';
      }
    });
  }
}