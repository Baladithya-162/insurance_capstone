import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  claims: any[] = [];
  error = '';
  description = '';
  amountClaimed: number | null = null;
  userPolicyId = '';
  incidentDate: string = '';
  userPolicies: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClaims();
    this.loadUserPolicies();
  }

  loadClaims() {
    this.http.get<any[]>(`${environment.apiUrl}/claims/claims`).subscribe({
      next: (data) => (this.claims = data),
      error: (err) => (this.error = err.error?.message || 'Failed to load claims'),
    });
  }

  loadUserPolicies() {
    this.http.get<any[]>(`${environment.apiUrl}/user/user/policies`).subscribe({
      next: (data) => (this.userPolicies = data || []),
      error: () => {}
    });
  }

  submitClaim() {
    if (!this.description || !this.amountClaimed || !this.userPolicyId) {
      this.error = 'All fields are required';
      return;
    }

    this.http.post(`${environment.apiUrl}/claims/claims`, {
      userPolicyId: this.userPolicyId,
      description: this.description,
      amountClaimed: this.amountClaimed,
      incidentDate: this.incidentDate ? new Date(this.incidentDate) : new Date()
    }).subscribe({
      next: () => {
        alert('Claim submitted successfully!');
        this.loadClaims();
      },
      error: (err) => alert(err.error?.message || 'Submit failed'),
    });
  }
}
