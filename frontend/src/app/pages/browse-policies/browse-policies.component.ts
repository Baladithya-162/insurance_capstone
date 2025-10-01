import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-browse-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './browse-policies.component.html',
  styleUrls: ['./browse-policies.component.css']
})
export class BrowsePoliciesComponent implements OnInit {
  policies: any[] = [];
  selectedPolicy: any = null;
  error = '';

  // Purchase form values
  nomineeName = '';
  nomineeRelation = '';
  termMonths: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies() {
    this.http.get<any[]>(`${environment.apiUrl}/policies/policies`).subscribe({
      next: (data) => (this.policies = data),
      error: (err) => (this.error = err.error?.message || 'Failed to load policies'),
    });
  }

  viewDetails(policy: any) {
    this.selectedPolicy = policy;
    // Reset form when opening details
    this.nomineeName = '';
    this.nomineeRelation = '';
    this.termMonths = policy.termMonths || null;
  }

  purchasePolicy(policyId: string) {
    if (!this.nomineeName || !this.nomineeRelation) {
      alert('Nominee details are required');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      alert('You must be logged in to purchase a policy.');
      return;
    }

    const body = {
      userId,
      nominee: { name: this.nomineeName, relation: this.nomineeRelation },
      termMonths: this.termMonths,
    };

    this.http.post(`${environment.apiUrl}/policies/policies/${policyId}/purchase`, body)
      .subscribe({
        next: () => {
          alert('Policy purchased successfully!');
          this.selectedPolicy = null;
          this.router.navigate(['dashboard/my-policies']);
        },
        error: (err) => alert(err.error?.message || 'Purchase failed'),
      });
  }
}
