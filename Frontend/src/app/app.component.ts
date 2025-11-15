import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CartService } from './services/cart.service';
import { AiAssistantComponent } from './components/ai-assistant.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, AiAssistantComponent], 
  template: `
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-6 py-3 flex justify-between items-center">
      <a class="font-bold text-2xl text-green-800" routerLink="/">Kraftory</a>
      <div class="flex space-x-6 text-gray-700 items-center">
        
        <a routerLink="/" class="hover:text-green-600">Home</a>

        <a *ngIf="isLoggedIn()" routerLink="/artisans" class="hover:text-green-600">Artisans</a>
        <a *ngIf="isLoggedIn()" routerLink="/cart" class="hover:text-green-600">Cart</a>
        <a *ngIf="isSeller()" routerLink="/seller-dashboard" class="hover:text-green-600">Dashboard</a>
        
        <a *ngIf="!isLoggedIn()" routerLink="/login" class="hover:text-green-600">Login</a>
        <a *ngIf="!isLoggedIn()" routerLink="/register" class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800">Register</a>
        
        <button *ngIf="isLoggedIn()" (click)="logout()" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
          Logout
        </button>
      </div>
    </div>
  </nav>
  <main class="container mx-auto p-6">
    <router-outlet></router-outlet>
  </main>
  <app-ai-assistant></app-ai-assistant>
`
})
export class AppComponent {

  constructor(private cartService: CartService, private router: Router) {}

  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') return false; 
    return !!localStorage.getItem('token');
  }

  isSeller(): boolean {
    if (!this.isLoggedIn()) {
      return false;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.role === 'seller';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.cartService.clearCartOnLogout(); 
    this.router.navigate(['/login']); 
  }
}