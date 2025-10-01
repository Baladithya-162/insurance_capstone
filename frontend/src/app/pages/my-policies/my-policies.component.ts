import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-policies.component.html',
  styleUrls: ['./my-policies.component.css']
})
export class MyPoliciesComponent implements OnInit {
  myPolicies: any[] = [];
  error = '';

  // Claim form state
  claimPolicyId: string | null = null;
  claimDescription = '';
  claimAmount: number | null = null;

  // Repay form state
  repayPolicyId: string | null = null;
  repayAmount: number | null = null;
  repayReference = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserPolicies();
  }

  loadUserPolicies() {
    // Backend mounts userPolicyRoutes at /api/v1/user and inside defines /user/policies
    // So full path is /api/v1/user/user/policies
    this.http.get<any[]>(`${environment.apiUrl}/user/user/policies`).subscribe({
      next: (data) => (this.myPolicies = data),
      error: (err) =>
        (this.error = err.error?.message || 'Failed to load your policies'),
    });
  }

  openClaim(policy: any) {
    this.claimPolicyId = policy._id;
    this.claimDescription = '';
    this.claimAmount = null;
  }

  submitClaim() {
    if (!this.claimPolicyId || !this.claimDescription || !this.claimAmount) {
      alert('Please fill description and amount');
      return;
    }

    this.http
      .post(`${environment.apiUrl}/claims/claims`, {
        userPolicyId: this.claimPolicyId,
        description: this.claimDescription,
        amountClaimed: this.claimAmount,
        incidentDate: new Date(),
      })
      .subscribe({
        next: () => {
          alert('Claim submitted');
          this.claimPolicyId = null;
          this.claimDescription = '';
          this.claimAmount = null;
        },
        error: (err) => alert(err.error?.message || 'Submit claim failed'),
      });
  }

  openRepay(policy: any) {
    this.repayPolicyId = policy._id;
    this.repayAmount = null;
    this.repayReference = '';
  }

  submitRepay() {
    if (!this.repayPolicyId || !this.repayAmount) {
      alert('Please enter amount');
      return;
    }

    const reference = this.repayReference && this.repayReference.trim().length > 0
      ? this.repayReference.trim()
      : `TXN-${Date.now()}`;

    this.http
      .post(`${environment.apiUrl}/payments/payments`, {
        policyId: this.repayPolicyId,
        amount: this.repayAmount,
        method: 'SIMULATED',
        reference,
      })
      .subscribe({
        next: () => {
          alert('Payment recorded');
          this.repayPolicyId = null;
          this.repayAmount = null;
          this.repayReference = '';
          this.loadUserPolicies();
        },
        error: (err) => alert(err.error?.message || 'Payment failed'),
      });
  }

  cancelPolicy(policy: any) {
    if (!policy?._id) return;
    const confirmMsg = `Cancel policy ${policy.policyProductId?.title || policy._id}?`;
    if (!confirm(confirmMsg)) return;

    this.http
      .put(`${environment.apiUrl}/user/user/policies/${policy._id}/cancel`, {})
      .subscribe({
        next: () => {
          alert('Policy cancelled');
          this.loadUserPolicies();
        },
        error: (err) => alert(err.error?.message || 'Cancel failed'),
      });
  }
}
