import { Routes } from '@angular/router';
import { HomeComponent } from '../app/pages/home.component';
import { LoginComponent } from '../app/pages/login.component';
import { RegisterComponent } from '../app/pages/register.component';
import { CartComponent } from '../app/pages/cart.component';
import { SellerDashboardComponent } from './pages/seller-dashboard.component';
import { ProductDetailComponent } from './pages/product-detail.component';
import { ArViewerComponent } from './pages/ar-viewer.component';
import { ArtisansListComponent } from './pages/artisans-list.component';
import { ArtisanProfileComponent } from './pages/artisan-profile/artisan-profile.component'; // <-- 1. Import new component
import { AuthGuard, SellerGuard } from './auth.guard';


export const routes: Routes = [
  // --- Public Routes (Visible to Everyone) ---
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'product/:slug', component: ProductDetailComponent },
  { path:'ar-viewer/:slug', component: ArViewerComponent },
  
  // --- Protected Routes (Login Required) ---
  { 
    path: 'artisans', 
    component: ArtisansListComponent,
    canActivate: [AuthGuard] // <-- 1. ADD THIS GUARD
  },
  { 
    path: 'artisan/:slug', 
    component: ArtisanProfileComponent,
    canActivate: [AuthGuard] // <-- 2. ADD THIS GUARD
  },
  { 
    path: 'cart', 
    component: CartComponent,
    canActivate: [AuthGuard] // 2. Add AuthGuard to the cart
  },
  { 
    path: 'seller-dashboard', 
    component: SellerDashboardComponent,
    canActivate: [SellerGuard] // 3. Add SellerGuard to the dashboard
  }
];