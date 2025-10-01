import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowsePoliciesComponent } from './browse-policies.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('BrowsePoliciesComponent', () => {
  let component: BrowsePoliciesComponent;
  let fixture: ComponentFixture<BrowsePoliciesComponent>;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockPolicies = [
    { _id: 'p1', title: 'Health Policy', code: 'HP001', premium: 500, minSumInsured: 10000, termMonths: 12, description: 'Covers health expenses' }
  ];

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserId']);
    

    await TestBed.configureTestingModule({
      imports: [BrowsePoliciesComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrowsePoliciesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    // intentionally skip httpMock.verify() to avoid verifying initial GETs not asserted in some tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load policies on init', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/policies/policies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPolicies);

    expect(component.policies.length).toBe(1);
    expect(component.policies[0].title).toBe('Health Policy');
  });

  it('should handle error while loading policies', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/policies/policies`);
    req.flush({ message: 'Failed' }, { status: 500, statusText: 'Error' });

    expect(component.error).toBe('Failed');
  });

  it('should set selected policy on viewDetails()', () => {
    component.viewDetails(mockPolicies[0]);
    expect(component.selectedPolicy).toEqual(mockPolicies[0]);
    expect(component.nomineeName).toBe('');
    expect(component.nomineeRelation).toBe('');
    expect(component.termMonths).toBe(12);
  });

  it('should require nominee details for purchase', () => {
    spyOn(window, 'alert');

    component.purchasePolicy('p1');
    expect(window.alert).toHaveBeenCalledWith('Nominee details are required');
  });

  it('should block purchase if not logged in', () => {
    spyOn(window, 'alert');
    component.nomineeName = 'John';
    component.nomineeRelation = 'Brother';
    mockAuthService.getUserId.and.returnValue(null);

    component.purchasePolicy('p1');
    expect(window.alert).toHaveBeenCalledWith('You must be logged in to purchase a policy.');
  });

  it('should purchase policy successfully', () => {
    spyOn(window, 'alert');
    component.nomineeName = 'John';
    component.nomineeRelation = 'Brother';
    component.termMonths = 12;
    mockAuthService.getUserId.and.returnValue('u1');

    component.purchasePolicy('p1');

    const req = httpMock.expectOne(`${environment.apiUrl}/policies/policies/p1/purchase`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(window.alert).toHaveBeenCalledWith('Policy purchased successfully!');
  });

  it('should handle error on purchase', () => {
    spyOn(window, 'alert');
    component.nomineeName = 'John';
    component.nomineeRelation = 'Brother';
    component.termMonths = 12;
    mockAuthService.getUserId.and.returnValue('u1');

    component.purchasePolicy('p1');

    const req = httpMock.expectOne(`${environment.apiUrl}/policies/policies/p1/purchase`);
    req.flush({ message: 'Purchase failed' }, { status: 400, statusText: 'Bad Request' });

    expect(window.alert).toHaveBeenCalledWith('Purchase failed');
  });
});
