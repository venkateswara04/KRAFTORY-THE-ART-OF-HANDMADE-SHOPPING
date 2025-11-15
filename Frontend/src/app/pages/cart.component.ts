import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Your Shopping Cart</h1>

      <div *ngIf="cartItems$ | async as items; else loading">

        <div *ngIf="items.length === 0" class="text-center py-16 px-6 bg-white rounded-lg shadow-md">
          <p class="text-gray-500 text-xl">Your cart is currently empty.</p>
          <a routerLink="/" class="mt-6 inline-block bg-green-700 text-white px-8 py-3 rounded-md hover:bg-green-800 font-semibold">
            Continue Shopping
          </a>
        </div>

        <div *ngIf="items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div class="lg:col-span-2 space-y-4">
            <div *ngFor="let item of items" class="flex items-center bg-white p-4 rounded-lg shadow-md">
              <img [src]="item.images?.[0] || 'assets/placeholder.png'" alt="{{item.title}}" class="w-24 h-24 object-cover rounded-md">
              <div class="flex-grow ml-4">
                <h2 class="font-semibold text-lg">{{ item.title }}</h2>
                <p class="text-gray-600">Quantity: {{ item.quantity }}</p>
                <p class="text-gray-800 font-bold">₹{{ item.price }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-lg">₹{{ item.price * item.quantity }}</p>
                <button (click)="onRemoveFromCart(item.id)" class="text-red-500 hover:underline text-sm mt-1">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="items.length > 0" class="lg:col-span-1">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-xl font-bold border-b pb-4">Order Summary</h2>
              <div class="flex justify-between items-center mt-4">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-semibold">₹{{ getTotal(items) }}</span>
              </div>
              <div class="flex justify-between items-center mt-2">
                <span class="text-gray-600">Shipping</span>
                <span class="font-semibold">FREE</span>
              </div>
              <div class="border-t mt-4 pt-4 flex justify-between items-center">
                <span class="text-xl font-bold">Total</span>
                <span class="text-xl font-bold">₹{{ getTotal(items) }}</span>
              </div>
              <button class="mt-6 w-full bg-gray-800 text-white px-8 py-3 rounded-md hover:bg-black font-semibold">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>

      </div>

      <ng-template #loading>
        <div class="text-center py-16">
          <p class="text-gray-500">Loading cart...</p>
        </div>
      </ng-template>
    </div>
  `
})
export class CartComponent {
  cartItems$: Observable<any[]>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  onRemoveFromCart(productId: any): void {
    this.cartService.removeFromCart(productId);
  }

  // FIX: Update getTotal() to accept the items array
  getTotal(items: any[] | null): number {
    if (!items) {
      return 0;
    }
    let total = 0;
    items.forEach(item => {
      total += item.price * item.quantity;
    });
    return total;
  }
}