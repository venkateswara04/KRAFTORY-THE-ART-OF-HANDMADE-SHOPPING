import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductCardComponent } from '../components/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Handcrafted Products</h1>
    <div *ngIf="isLoading" class="text-center text-gray-500">Loading products...</div>
    <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <app-product-card 
        *ngFor="let p of products" 
        [product]="p" 
        (addToCart)="onAddToCart($event)">
      </app-product-card>
    </div>
  `
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  isLoading = true;

  constructor(
    private api: ApiService, 
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.api.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to fetch products:", err);
        this.isLoading = false;
      }
    });
  }

  onAddToCart(product: any): void {
    this.cartService.addToCart(product);
  }
}