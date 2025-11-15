import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="product" class="border rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <a [routerLink]="['/product', product.slug]">
        <img [src]="product.images?.[0] || 'assets/placeholder.png'" alt="{{product.title}}" class="w-full h-56 object-cover">
      </a>
      
      <div class="p-4">
        <h2 class="font-semibold text-lg text-gray-900 truncate">{{product.title}}</h2>
        <p class="text-sm text-gray-600">by {{ product.artisan?.name || 'Unknown Artisan' }}</p>
        <p class="text-xl font-bold text-green-700 mt-2">₹{{product.price}}</p>
        <button (click)="onAddToCart()" class="mt-4 w-full bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800">
          Add to Cart
        </button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product: any;
  @Output() addToCart = new EventEmitter<any>();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}