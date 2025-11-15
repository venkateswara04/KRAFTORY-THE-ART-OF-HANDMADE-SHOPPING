import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center text-gray-800">Welcome Back</h1>
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="space-y-4">
            <div>
              <label for="email" class="text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="email" required [(ngModel)]="credentials.email"
                     class="w-full px-3 py-2 mt-1 border rounded-md">
            </div>
            <div>
              <label for="password" class="text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" required [(ngModel)]="credentials.password"
                     class="w-full px-3 py-2 mt-1 border rounded-md">
            </div>
          </div>
          <div *ngIf="errorMessage" class="p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-md">
            {{ errorMessage }}
          </div>
          <button type="submit" [disabled]="!loginForm.valid || isLoading"
                  class="w-full px-4 py-2 mt-6 font-semibold text-white bg-green-700 rounded-md disabled:bg-gray-400">
            {{ isLoading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>
        <p class="text-sm text-center text-gray-600">
          Don't have an account? <a routerLink="/register" class="font-medium text-green-700">Sign up</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private api: ApiService,
    private router: Router,
    private cartService: CartService
  ) {}

  onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    this.api.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        this.cartService.mergeGuestCartAfterLogin();

        if (response.user.role === 'seller') {
          this.router.navigate(['/seller-dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.msg || 'Login failed.';
      }
    });
  }
}