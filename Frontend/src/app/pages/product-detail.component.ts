import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, QRCodeModule], 
  template: `
    <div *ngIf="product" class="container mx-auto p-6">
      <div class="flex flex-col md:flex-row gap-8">
        
        <div class="md:w-1/2">
          <img [src]="product.images?.[0] || 'assets/placeholder.png'" alt="{{product.title}}" class="w-full rounded-lg shadow-lg">
        </div>

        <div class="md:w-1/2">
          <h1 class="text-4xl font-bold text-gray-800">{{ product.title }}</h1>
          <p class="text-lg text-gray-600 mt-2">by 
            <a [routerLink]="['/artisan', product.artisan?.slug]" class="text-green-700 hover:underline">
              {{ product.artisan?.name }}
            </a>
          </p>
          <p class="text-3xl font-bold text-green-700 mt-4">₹{{ product.price }}</p>
          <p class="mt-4 text-gray-700">{{ product.description }}</p>
          
          <button (click)="onAddToCart()" class="mt-6 w-full bg-green-700 text-white px-8 py-3 rounded-md hover:bg-green-800 text-lg font-semibold">
            Add to Cart
          </button>

          <div *ngIf="isLoggedIn(); else showLoginPrompt">

            <div class="mt-6 pt-4 border-t">
              <h3 class="text-xl font-semibold text-gray-700 mb-2">Artisan Details</h3>
              <p class="text-lg text-gray-600">
                {{ product.artisan?.name }}
              </p>
              <div *ngIf="product.artisan?.contactNumber || product.artisan?.address" class="mt-2 text-sm text-gray-600">
                <p *ngIf="product.artisan.contactNumber">
                  <span class="font-medium">Contact:</span> {{ product.artisan.contactNumber }}
                </p>
                <p *ngIf="product.artisan.address">
                  <span class="font-medium">Address:</span> {{ product.artisan.address }}
                </p>
              </div>
            </div>

            <div *ngIf="product.heritage_video_url" class="mt-8 p-4 border rounded-lg text-center bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Scan for AR Heritage Story</h3>
              <div class="flex justify-center">
                <qrcode 
                  [qrdata]="'http://' + this.api.baseUrl.split('/')[2].split(':')[0] + ':4200/ar-viewer/' + product.slug"
                  [width]="150"
                  [errorCorrectionLevel]="'M'">
                </qrcode>
              </div>
              <p class="text-xs text-gray-500 mt-2">Point your phone's camera at the code</p>
            </div>

          </div> <ng-template #showLoginPrompt>
            <div class="mt-8 p-6 border rounded-lg text-center bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Want to see more?</h3>
              <p class="text-gray-600">
                <a routerLink="/login" class="text-green-700 font-bold hover:underline">Log in</a> or 
                <a routerLink="/register" class="text-green-700 font-bold hover:underline">Register</a>
                to view the artisan's contact details and the interactive AR heritage story.
              </p>
            </div>
          </ng-template>
          </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    public api: ApiService, 
    private cartService: CartService 
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.params['slug'];
    if (slug) {
      this.api.getProduct(slug).subscribe(res => {
        this.product = res;
      });
    }
  }

  onAddToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      alert(`${this.product.title} has been added to your cart!`);
    }
  }

  
  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') return false; 
    return !!localStorage.getItem('token');
  }
}