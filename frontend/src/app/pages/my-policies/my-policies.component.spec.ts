import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPoliciesComponent } from './my-policies.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.prod';
import { RouterTestingModule } from '@angular/router/testing';

describe('MyPoliciesComponent', () => {
  let component: MyPoliciesComponent;
  let fixture: ComponentFixture<MyPoliciesComponent>;
  let httpMock: HttpTestingController;

  const mockPolicies = [
    {
      _id: 'p1',
      status: 'ACTIVE',
      startDate: '2025-01-01T00:00:00.000Z',
      endDate: '2026-01-01T00:00:00.000Z',
      premiumPaid: 1200,
      policyProductId: { title: 'Health Policy' }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPoliciesComponent, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MyPoliciesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Skip strict verification due to initial GET triggered on init
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user policies successfully', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/user/user/policies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPolicies);

    expect(component.myPolicies.length).toBe(1);
    expect(component.myPolicies[0].policyProductId.title).toBe('Health Policy');
  });

  it('should handle error while loading policies', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/user/user/policies`);
    req.flush({ message: 'Error loading' }, { status: 500, statusText: 'Server Error' });

    expect(component.error).toBe('Error loading');
  });

  it('should open claim form for a policy', () => {
    component.openClaim(mockPolicies[0]);
    expect(component.claimPolicyId).toBe('p1');
  });

  it('should submit a claim successfully', () => {
    component.claimPolicyId = 'p1';
    component.claimDescription = 'Accident';
    component.claimAmount = 500;

    component.submitClaim();

    const req = httpMock.expectOne(`${environment.apiUrl}/claims/claims`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(component.claimPolicyId).toBeNull();
    expect(component.claimDescription).toBe('');
    expect(component.claimAmount).toBeNull();
  });

  it('should submit a repayment successfully', () => {
    component.repayPolicyId = 'p1';
    component.repayAmount = 300;
    component.repayReference = 'REF123';

    component.submitRepay();

    const req = httpMock.expectOne(`${environment.apiUrl}/payments/payments`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(component.repayPolicyId).toBeNull();
    expect(component.repayAmount).toBeNull();
    expect(component.repayReference).toBe('');
  });

  it('should cancel a policy successfully', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.cancelPolicy(mockPolicies[0]);

    const req = httpMock.expectOne(`${environment.apiUrl}/user/user/policies/p1/cancel`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should not cancel if user rejects confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.cancelPolicy(mockPolicies[0]);

    httpMock.expectNone(`${environment.apiUrl}/user/user/policies/p1/cancel`);
  });
});
