import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 1. Import RouterModule
import { ApiService } from '../services/api.service'; // 2. Import ApiService

@Component({
  selector: 'app-artisans-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // 3. Add RouterModule
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Meet Our Artisans</h1>
      
      <div *ngIf="isLoading" class="text-center text-gray-500">
        Loading artisans...
      </div>

      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div *ngFor="let artisan of artisans" class="p-4 border rounded-lg shadow-md text-center bg-white hover:shadow-xl transition-shadow">
          <h2 class="text-xl font-semibold text-gray-800">{{ artisan.name }}</h2>
          <a [routerLink]="['/artisan', artisan.slug]" class="inline-block mt-2 bg-green-700 text-white px-4 py-1 rounded-md text-sm hover:bg-green-800">
            View Profile
          </a>
        </div>
      </div>

      <div *ngIf="!isLoading && artisans.length === 0" class="text-center text-gray-500">
        No artisans have been added yet.
      </div>
    </div>
  `
})
export class ArtisansListComponent implements OnInit {
  
  artisans: any[] = [];
  isLoading = true;

  constructor(private api: ApiService) {} // 4. Inject ApiService

  ngOnInit() {
    // 5. Fetch the list of artisans when the component loads
    this.api.getArtisans().subscribe({
      next: (data) => {
        this.artisans = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to fetch artisans:", err);
        this.isLoading = false;
      }
    });
  }
}