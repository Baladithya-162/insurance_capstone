import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard, adminGuard } from './auth.guard';
import { of } from 'rxjs';

describe('Guards', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/test' } as RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkLogin'], {
      user$: of(null)
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  describe('authGuard', () => {
    it('should return true if logged in', () => {
      authServiceSpy.checkLogin.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to /login if not logged in', () => {
      authServiceSpy.checkLogin.and.returnValue(false);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('adminGuard', () => {
    it('should return true if user is admin', () => {
      authServiceSpy.checkLogin.and.returnValue(true);
      authServiceSpy.user$ = of({ _id: '1', name: 'Admin', email: 'a@a.com', role: 'admin' });

      const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));
      expect(result).toBeFalse();
    });

    it('should redirect to /dashboard if user is not admin', () => {
      authServiceSpy.checkLogin.and.returnValue(true);
      authServiceSpy.user$ = of({ _id: '2', name: 'User', email: 'u@u.com', role: 'customer' });

      const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should redirect to /dashboard if not logged in', () => {
      authServiceSpy.checkLogin.and.returnValue(false);

      const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });
});
