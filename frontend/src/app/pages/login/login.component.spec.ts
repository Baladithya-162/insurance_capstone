import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoginComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set error when login succeeds', () => {
    mockAuthService.login.and.returnValue(of({ token: 'abc', user: { _id: 'u1', name: 'Test', email: 't@t.com', role: 'customer' } }));

    component.email = 't@t.com';
    component.password = '1234';
    component.onLogin();

    expect(component.error).toBe('');
    expect(mockAuthService.login).toHaveBeenCalledWith('t@t.com', '1234');
  });

  it('should set error when login fails', () => {
    mockAuthService.login.and.returnValue(throwError(() => ({ error: { message: 'Login failed' } })));

    component.email = 'wrong@t.com';
    component.password = 'bad';
    component.onLogin();

    expect(component.error).toBe('Login failed');
  });
});
