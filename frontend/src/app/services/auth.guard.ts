import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.checkLogin()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.checkLogin()) {
    // naive role check using last known user
    let isAdmin = false;
    authService.user$.subscribe((u) => (isAdmin = u?.role === 'admin')).unsubscribe();
    if (isAdmin) return true;
  }
  router.navigate(['/dashboard']);
  return false;
};