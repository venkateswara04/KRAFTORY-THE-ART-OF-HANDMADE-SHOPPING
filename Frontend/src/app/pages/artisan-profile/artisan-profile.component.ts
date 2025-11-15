import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ProductCardComponent } from '../../components/product-card.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-artisan-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div *ngIf="artisan" class="container mx-auto p-6">
      <div class="p-8 bg-white rounded-lg shadow-md text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">{{ artisan.name }}</h1>
        <p class="text-lg text-gray-600 mt-2">{{ artisan.location }}</p>
        <p class="mt-4 text-gray-700 max-w-2xl mx-auto">{{ artisan.bio }}</p>
        <p class="mt-2 text-sm text-gray-500"><strong>Contact:</strong> {{ artisan.contactNumber }}</p>
        <p class="text-sm text-gray-500"><strong>Address:</strong> {{ artisan.address }}</p>
      </div>

      <h2 class="text-2xl font-bold text-gray-800 mb-6">Products by {{ artisan.name }}</h2>
      
      <div *ngIf="products.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <app-product-card 
          *ngFor="let p of products" 
          [product]="p" 
          (addToCart)="onAddToCart($event)">
        </app-product-card>
      </div>
      
      <div *ngIf="products.length === 0" class="text-center text-gray-500">
        This artisan has not added any products yet.
      </div>

    </div>
    
    <div *ngIf="!artisan" class="text-center text-gray-500 p-8">
      Loading artisan profile...
    </div>
  `
})
export class ArtisanProfileComponent implements OnInit {

  artisan: any;
  products: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Get the 'slug' from the URL
    const slug = this.route.snapshot.params['slug'];
    if (slug) {
      // Call the API endpoint we created earlier
      this.api.getArtisan(slug).subscribe({
        next: (data) => {
          this.artisan = data.artisan;
          this.products = data.products;
        },
        error: (err) => {
          console.error("Failed to fetch artisan data:", err);
          // Handle error (e.g., redirect to a 404 page)
        }
      });
    }
  }

  onAddToCart(product: any): void {
    this.cartService.addToCart(product);
    alert(`${product.title} has been added to your cart!`);
  }
}