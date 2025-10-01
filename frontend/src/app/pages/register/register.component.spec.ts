import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../models/user';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockUser: User = {
    _id: '123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'customer'
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if fields are missing', () => {
    component.name = '';
    component.email = '';
    component.password = '';
    component.onRegister();
    expect(component.error).toBe('All fields are required');
  });

  it('should call AuthService.register with correct data', () => {
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = 'password123';
    authServiceSpy.register.and.returnValue(of(mockUser));

    component.onRegister();

    expect(authServiceSpy.register).toHaveBeenCalledWith(
      'Test User',
      'test@example.com',
      'password123'
    );
  });

  it('should set success message and redirect on successful register', (done) => {
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = 'password123';
    authServiceSpy.register.and.returnValue(of(mockUser));

    component.onRegister();

    expect(component.success).toBe('Registration successful! Redirecting to login...');
    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    }, 1600);
  });

  it('should set error message on registration failure', () => {
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = 'password123';
    authServiceSpy.register.and.returnValue(
      throwError(() => ({ error: { message: 'Email already exists' } }))
    );

    component.onRegister();

    expect(component.error).toBe('Email already exists');
  });
});
