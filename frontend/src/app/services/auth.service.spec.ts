import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { User } from '../models/user';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let jwtHelper: JwtHelperService;

  const mockUser: User = {
    _id: '123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'customer'
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    jwtHelper = TestBed.inject(JwtHelperService);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call register API', () => {
    service.register('John', 'john@example.com', 'secret').subscribe((res) => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should call login API and store token + user', () => {
    const fakeToken = 'fake.jwt.token';
    const response = { token: fakeToken, user: mockUser };

    service.login('john@example.com', 'secret').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(response);

    expect(localStorage.getItem('token')).toBe(fakeToken);
    service.user$.subscribe((u) => {
      expect(u).toEqual(mockUser);
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to /admin if user is admin', () => {
    const fakeToken = 'fake.jwt.token';
    const adminUser = { ...mockUser, role: 'admin' };
    const response = { token: fakeToken, user: adminUser };

    service.login('admin@example.com', 'secret').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(response);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should clear user and token on logout', () => {
    localStorage.setItem('token', 'some-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    service.user$.subscribe((u) => expect(u).toBeNull());
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('getUserId should decode userId from token', () => {
    // fake a token with payload { userId: "123" }
    const payload = { userId: '123' };
    spyOn(jwtHelper, 'decodeToken').and.returnValue(payload);
    localStorage.setItem('token', 'fake.jwt.token');

    const id = service.getUserId();
    expect(id).toBe('123');
  });

  it('getUserId should return null if no token', () => {
    expect(service.getUserId()).toBeNull();
  });
});
