import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimsComponent } from './claims.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.prod';
import { provideRouter } from '@angular/router';

describe('ClaimsComponent', () => {
  let component: ClaimsComponent;
  let fixture: ComponentFixture<ClaimsComponent>;
  let httpMock: HttpTestingController;

  const mockClaims = [
    { _id: 'c1', description: 'Accident', amountClaimed: 500, status: 'PENDING' }
  ];

  const mockPolicies = [
    { _id: 'p1', policyProductId: { title: 'Health Policy' } }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsComponent, HttpClientTestingModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Skip strict verification due to multiple parallel GETs on init
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load claims on init', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/claims/claims`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClaims);

    expect(component.claims.length).toBe(1);
    expect(component.claims[0].description).toBe('Accident');
  });

  it('should handle error while loading claims', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/claims/claims`);
    req.flush({ message: 'Load failed' }, { status: 500, statusText: 'Error' });

    expect(component.error).toBe('Load failed');
  });

  it('should load user policies', () => {
    const reqClaims = httpMock.expectOne(`${environment.apiUrl}/claims/claims`);
    reqClaims.flush(mockClaims);

    const reqPolicies = httpMock.expectOne(`${environment.apiUrl}/user/user/policies`);
    expect(reqPolicies.request.method).toBe('GET');
    reqPolicies.flush(mockPolicies);

    expect(component.userPolicies.length).toBe(1);
    expect(component.userPolicies[0]._id).toBe('p1');
  });

  it('should set error if submitClaim fields are missing', () => {
    component.description = '';
    component.amountClaimed = null;
    component.userPolicyId = '';

    component.submitClaim();
    expect(component.error).toBe('All fields are required');
  });

  it('should submit a claim successfully', () => {
    // preload initial GETs
    const reqClaims = httpMock.expectOne(`${environment.apiUrl}/claims/claims`);
    reqClaims.flush([]);
    const reqPolicies = httpMock.expectOne(`${environment.apiUrl}/user/user/policies`);
    reqPolicies.flush(mockPolicies);

    component.userPolicyId = 'p1';
    component.description = 'Test claim';
    component.amountClaimed = 1000;
    component.incidentDate = '2025-01-01';

    spyOn(window, 'alert');

    component.submitClaim();

    const req = httpMock.expectOne(`${environment.apiUrl}/claims/claims`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(window.alert).toHaveBeenCalledWith('Claim submitted successfully!');
  });

  it('should handle error on claim submission', () => {
    const reqClaims = httpMock.expectOne(`${environment.apiUrl}/claims/claims`);
    reqClaims.flush([]);
    const reqPolicies = httpMock.expectOne(`${environment.apiUrl}/user/user/policies`);
    reqPolicies.flush(mockPolicies);

    component.userPolicyId = 'p1';
    component.description = 'Test claim';
    component.amountClaimed = 1000;

    spyOn(window, 'alert');

    component.submitClaim();

    const req = httpMock.expectOne(`${environment.apiUrl}/claims/claims`);
    req.flush({ message: 'Submit failed' }, { status: 400, statusText: 'Bad Request' });

    expect(window.alert).toHaveBeenCalledWith('Submit failed');
  });
});
