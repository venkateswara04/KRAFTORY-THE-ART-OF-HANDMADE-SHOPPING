import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Checks if a user is logged in by looking for a token.
 */
const isLoggedIn = (): boolean => {
  if (typeof localStorage !== 'undefined') { // Check if localStorage is available
    return !!localStorage.getItem('token');
  }
  return false;
};

/**
 * Checks if the logged-in user has the 'seller' role.
 */
const isSeller = (): boolean => {
  if (!isLoggedIn()) {
    return false;
  }
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user && user.role === 'seller';
};

/**
 * A Route Guard that blocks access if the user is NOT logged in.
 * If blocked, it redirects them to the /login page.
 */
export const AuthGuard = () => {
  const router = inject(Router);

  if (isLoggedIn()) {
    return true; // User is logged in, allow access
  }

  // User is not logged in, redirect to login
  router.navigate(['/login']);
  return false;
};

/**
 * A Route Guard that blocks access if the user is NOT a 'seller'.
 * If blocked, it redirects them to the / page.
 */
export const SellerGuard = () => {
  const router = inject(Router);

  if (isSeller()) {
    return true; // User is a seller, allow access
  }

  // User is not a seller, redirect to home
  router.navigate(['/']);
  return false;
};