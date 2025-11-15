import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Seller Dashboard</h1>
      <div class="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-700">Add a New Product</h2>
        <form (ngSubmit)="onAddProduct()">
          <div class="space-y-4">
            <div>
              <label for="title" class="text-sm font-medium text-gray-700">Product Title</label>
              <input name="title" type="text" [(ngModel)]="product.title" required class="w-full px-3 py-2 mt-1 border rounded-md">
            </div>
            <div>
              <label for="description" class="text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" [(ngModel)]="product.description" required rows="4" class="w-full px-3 py-2 mt-1 border rounded-md"></textarea>
            </div>
            <div>
              <label for="price" class="text-sm font-medium text-gray-700">Price (₹)</label>
              <input name="price" type="number" [(ngModel)]="product.price" required class="w-full px-3 py-2 mt-1 border rounded-md">
            </div>
            <hr class="my-4">
            <h3 class="text-lg font-semibold text-gray-700">Artisan Details</h3>
            <div>
              <label for="artisan_name" class="text-sm font-medium text-gray-700">Artisan Name</label>
              <input name="artisan_name" type="text" [(ngModel)]="product.artisan_name" required class="w-full px-3 py-2 mt-1 border rounded-md">
            </div>
            <div>
              <label for="artisan_contact" class="text-sm font-medium text-gray-700">Contact</label>
              <input name="artisan_contact" type="tel" [(ngModel)]="product.artisan_contact" class="w-full px-3 py-2 mt-1 border rounded-md">
            </div>
            <div>
              <label for="artisan_address" class="text-sm font-medium text-gray-700">Address</label>
              <textarea name="artisan_address" [(ngModel)]="product.artisan_address" rows="3" class="w-full px-3 py-2 mt-1 border rounded-md"></textarea>
            </div>
            <hr class="my-4">
            <div>
              <label for="image" class="text-sm font-medium text-gray-700">Product Image (Required)</label>
              <input name="image" type="file" (change)="onImageSelected($event)" required accept="image/*" class="w-full text-sm">
            </div>
            <div>
              <label for="heritage_video" class="text-sm font-medium text-gray-700">Heritage Video (Optional)</label>
              <input name="heritage_video" type="file" (change)="onVideoSelected($event)" accept="video/*" class="w-full text-sm">
            </div>
          </div>
          <div *ngIf="message" [ngClass]="isError ? 'text-red-700' : 'text-green-700'" class="p-3 mt-4 text-sm">
            {{ message }}
          </div>
          <button type="submit" [disabled]="isLoading" class="w-full px-4 py-2 mt-6 font-semibold text-white bg-green-700 rounded-md disabled:bg-gray-400">
            {{ isLoading ? 'Adding...' : 'Add Product' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class SellerDashboardComponent {
  product = {
    title: '',
    description: '',
    price: 0,
    artisan_name: '',
    artisan_contact: '',
    artisan_address: ''
  };
  selectedImageFile: File | null = null;
  selectedVideoFile: File | null = null;
  message: string | null = null;
  isError = false;
  isLoading = false;

  constructor(private api: ApiService) {}

  onImageSelected(event: any): void {
    this.selectedImageFile = event.target.files[0] ?? null;
  }

  onVideoSelected(event: any): void {
    this.selectedVideoFile = event.target.files[0] ?? null;
  }

  onAddProduct(): void {
    if (!this.selectedImageFile) {
      this.message = 'Please select a product image.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = null;
    this.isError = false;

    const formData = new FormData();
    formData.append('title', this.product.title);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('artisan_name', this.product.artisan_name);
    formData.append('artisan_contact', this.product.artisan_contact);
    formData.append('artisan_address', this.product.artisan_address);
    formData.append('image', this.selectedImageFile, this.selectedImageFile.name);

    if (this.selectedVideoFile) {
      formData.append('heritage_video', this.selectedVideoFile, this.selectedVideoFile.name);
    }

    this.api.addProduct(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message = 'Product added successfully!';
        this.isError = false;
        this.product = { title: '', description: '', price: 0, artisan_name: '', artisan_contact: '', artisan_address: '' };
        this.selectedImageFile = null;
        this.selectedVideoFile = null;
      },
      error: (err) => {
        this.isLoading = false;
        this.message = err.error?.msg || 'Failed to add product.';
        this.isError = true;
      }
    });
  }
}