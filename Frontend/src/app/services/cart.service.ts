import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';
  private guestCartKey = 'guest_cart';

  private cartItemsSource = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadInitialCart();
  }

  private isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private handleAuthError(): void {
    alert('Your session has expired. Please log in again.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.cartItemsSource.next([]);
    this.router.navigate(['/login']);
  }

  loadInitialCart(): void {
    if (this.isLoggedIn()) {
      this.fetchCartFromBackend().subscribe();
    } else {
      const storedCart = localStorage.getItem(this.guestCartKey);
      this.cartItemsSource.next(storedCart ? JSON.parse(storedCart) : []);
    }
  }

  fetchCartFromBackend(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      tap(items => {
        const cartData = items.map(item => ({
          ...item.product,
          quantity: item.quantity
        }));
        this.cartItemsSource.next(cartData);
      }),
      catchError(err => {
        if (err.status === 401) {
          this.handleAuthError();
        }
        this.cartItemsSource.next([]);
        return of([]);
      })
    );
  }

  private saveGuestCart(cart: any[]): void {
    this.cartItemsSource.next(cart);
    localStorage.setItem(this.guestCartKey, JSON.stringify(cart));
  }

  addToCart(product: any): void {
    if (!product || !product.id) { return; }
    
    const productToAdd = { product_id: product.id, quantity: 1 };

    if (this.isLoggedIn()) {
      this.http.post(`${this.apiUrl}/add`, productToAdd, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          this.fetchCartFromBackend().subscribe(); 
          alert(`${product.title} added to your cart!`);
        },
        error: (err) => {
          if (err.status === 401) {
            this.handleAuthError();
          } else {
            alert(`Could not add ${product.title} to cart.`);
          }
        }
      });
    } else {
      const currentCart = this.cartItemsSource.getValue();
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        currentCart.push({ ...product, quantity: 1 });
      }
      this.saveGuestCart(currentCart);
      alert(`${product.title} added to guest cart!`);
    }
  }

  removeFromCart(productId: any): void {
    if (!productId){ return; }

    if (this.isLoggedIn()) {
      this.http.delete(`${this.apiUrl}/remove/${productId}`, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          this.fetchCartFromBackend().subscribe();
        },
        error: (err) => {
          if (err.status === 401) { this.handleAuthError(); }
        }
      });
    } else {
      let currentCart = this.cartItemsSource.getValue();
      currentCart = currentCart.filter(item => item.id !== productId);
      this.saveGuestCart(currentCart);
    }
  }

  getCartItems(): any[] {
    return this.cartItemsSource.getValue();
  }

  mergeGuestCartAfterLogin(): void {
    const guestCartJson = localStorage.getItem(this.guestCartKey);
    if (!guestCartJson) return; 

    const guestCart: any[] = JSON.parse(guestCartJson);
    if (guestCart.length === 0) return;

    guestCart.forEach(item => {
      const payload = { product_id: item.id, quantity: item.quantity };
      this.http.post(`${this.apiUrl}/add`, payload, { headers: this.getAuthHeaders() })
        .subscribe({
          error: err => console.error(`Failed to merge item ${item.id}`, err)
        });
    });

    localStorage.removeItem(this.guestCartKey);
    setTimeout(() => this.fetchCartFromBackend().subscribe(), 1500);
  }

  clearCartOnLogout(): void {
    this.cartItemsSource.next([]);
  }
}