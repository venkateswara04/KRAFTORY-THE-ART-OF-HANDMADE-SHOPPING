import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public baseUrl = 'http://10.138.65.148:5000/api';
  public authUrl = 'http://10.138.65.148:5000/auth';
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products`);
  }

  getProduct(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${slug}`);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials);
  }

  addProduct(productData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}/products`, productData, { headers: headers });
  }
  getArtisans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/artisans`);
  }
  askAi(question: string): Observable<any> {
    const url = `${this.baseUrl}/ai/assist`; // Calls /api/ai/assist
    // Note: This endpoint is not authenticated
    return this.http.post(url, { question });
  }

  getArtisan(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/artisan/${slug}`);
  }
  
}