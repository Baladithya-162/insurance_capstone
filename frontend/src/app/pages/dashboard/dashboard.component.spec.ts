import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockUser = {
    _id: '123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'customer'
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      user$: of(mockUser) // user$ emits mock user
    });
    

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges(); // trigger subscription
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to user$ and set user', () => {
    expect(component.user).toEqual(mockUser);
  });

  it('should call logout on AuthService and navigate to login', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should render user name and role in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Test User');
    expect(compiled.querySelector('p strong')?.textContent).toContain('customer');
  });

  it('should show admin portal button if role is admin', async () => {
    // recreate component with admin role via new TestBed
    TestBed.resetTestingModule();
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      user$: of({ ...mockUser, role: 'admin' })
    });
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();
    const newFixture = TestBed.createComponent(DashboardComponent);
    const newCompiled = newFixture.nativeElement as HTMLElement;
    newFixture.detectChanges();

    expect(newCompiled.querySelector('button[routerLink="/admin"]')).toBeTruthy();
  });
});
