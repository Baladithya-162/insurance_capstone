import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  summary: any = null;
  audit: any[] = [];
  auditFiltered: any[] = [];
  auditSearch = '';
  auditAction = '';
  auditFrom: string = '';
  auditTo: string = '';
  claims: any[] = [];
  agents: any[] = [];
  userPolicies: any[] = [];
  policyMap: Record<string, string> = {};
  policies: any[] = [];
  adminPayments: any[] = [];
  adminPaymentsFiltered: any[] = [];
  paymentSearch = '';
  paymentMin: number | null = null;
  paymentMax: number | null = null;

  // create policy form
  policyCode = '';
  policyTitle = '';
  policyDescription = '';
  policyPremium: number | null = null;
  policyTermMonths: number | null = null;
  policyMinSumInsured: number | null = null;

  // agent form
  agentName = '';
  agentEmail = '';
  agentPassword = '';

  // assign form
  selectedPolicyId = '';
  selectedAgentId = '';

  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadAudit();
    this.loadClaims();
    this.loadAgents();
    this.loadUserPolicies();
    this.loadPolicies();
    this.loadAdminPayments();
  }

  loadSummary() {
    this.http.get(`${environment.apiUrl}/admin/summary`).subscribe({
      next: (data) => (this.summary = data),
      error: (err) => (this.error = err.error?.message || 'Failed summary')
    });
  }

  loadAudit() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/admin/audit`).subscribe({
      next: (data) => { this.audit = data || []; this.applyAuditFilters(); },
      error: () => {}
    });
  }

  loadClaims() {
    this.http.get<any[]>(`${environment.apiUrl}/claims/claims`).subscribe({
      next: (data) => (this.claims = data || []),
      error: () => {}
    });
  }

  loadAgents() {
    this.http.get<any[]>(`${environment.apiUrl}/agents/`).subscribe({
      next: (data) => (this.agents = data || []),
      error: () => {}
    });
  }

  applyAuditFilters() {
    const term = (this.auditSearch || '').toLowerCase();
    const action = this.auditAction || '';
    const from = this.auditFrom ? new Date(this.auditFrom).getTime() : -Infinity;
    const to = this.auditTo ? new Date(this.auditTo).getTime() : Infinity;

    this.auditFiltered = (this.audit || []).filter((a: any) => {
      const when = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const label = `${a.action || ''} ${JSON.stringify(a.details || {})}`.toLowerCase();
      const matchesTerm = label.includes(term);
      const matchesAction = action ? a.action === action : true;
      const matchesDate = when >= from && when <= to;
      return matchesTerm && matchesAction && matchesDate;
    });
  }

  loadPolicies() {
    this.http.get<any[]>(`${environment.apiUrl}/policies/policies`).subscribe({
      next: (data) => (this.policies = data || []),
      error: () => {}
    });
  }

  loadUserPolicies() {
    // Build a richer list by joining claims (for user info) with policy products (for titles)
    this.http.get<any[]>(`${environment.apiUrl}/claims/claims`).subscribe({
      next: (claims) => {
        this.http.get<any[]>(`${environment.apiUrl}/policies/policies`).subscribe({
          next: (products) => {
            this.policyMap = {};
            (products || []).forEach((pp: any) => (this.policyMap[pp._id] = pp.title));

            const byId = new Map<string, any>();
            (claims || []).forEach((cl: any) => {
              const up = cl.userPolicyId;
              if (!up?._id) return;
              if (byId.has(up._id)) return;
              const userName = cl.userId?.name || cl.userId?.email || 'user';
              const policyTitle = this.policyMap[up.policyProductId] || 'policy';
              byId.set(up._id, {
                _id: up._id,
                userName,
                policyTitle,
                label: `${up._id} - ${userName} - ${policyTitle}`,
              });
            });

            this.userPolicies = Array.from(byId.values());
          },
          error: () => {
            this.userPolicies = [];
          }
        });
      },
      error: () => { this.userPolicies = []; }
    });
  }

  decideClaim(claimId: string, status: 'APPROVED' | 'REJECTED') {
    this.http.put(`${environment.apiUrl}/claims/claims/${claimId}/status`, { status }).subscribe({
      next: () => this.loadClaims(),
      error: (err) => alert(err.error?.message || 'Update failed')
    });
  }

  createAgent() {
    if (!this.agentName || !this.agentEmail || !this.agentPassword) { alert('Name, email and password required'); return; }
    this.http.post(`${environment.apiUrl}/agents/`, { name: this.agentName, email: this.agentEmail, password: this.agentPassword }).subscribe({
      next: () => { this.agentName = ''; this.agentEmail = ''; this.loadAgents(); },
      error: (err) => alert(err.error?.message || 'Create agent failed')
    });
  }

  assignAgent() {
    if (!this.selectedPolicyId || !this.selectedAgentId) { alert('Select policy and agent'); return; }
    this.http.put(`${environment.apiUrl}/agents/${this.selectedPolicyId}/assign`, { agentId: this.selectedAgentId }).subscribe({
      next: () => { alert('Assigned'); this.selectedPolicyId = ''; this.selectedAgentId = ''; },
      error: (err) => alert(err.error?.message || 'Assign failed')
    });
  }

  deletePolicy(policyId: string) {
    if (!policyId) return;
    if (!confirm('Delete this policy product?')) return;
    this.http.delete(`${environment.apiUrl}/policies/policies/${policyId}/delete`).subscribe({
      next: () => { this.loadPolicies(); alert('Policy deleted'); },
      error: (err) => alert(err.error?.message || 'Delete failed')
    });
  }

  createPolicy() {
    if (!this.policyCode || !this.policyTitle || !this.policyDescription || !this.policyPremium || !this.policyTermMonths || !this.policyMinSumInsured) {
      alert('All fields are required');
      return;
    }
    const body = {
      code: this.policyCode,
      title: this.policyTitle,
      description: this.policyDescription,
      premium: this.policyPremium,
      termMonths: this.policyTermMonths,
      minSumInsured: this.policyMinSumInsured,
    };
    this.http.post(`${environment.apiUrl}/policies/policies/create`, body).subscribe({
      next: () => {
        alert('Policy created');
        this.policyCode = '';
        this.policyTitle = '';
        this.policyDescription = '';
        this.policyPremium = null;
        this.policyTermMonths = null;
        this.policyMinSumInsured = null;
        this.loadPolicies();
      },
      error: (err) => alert(err.error?.message || 'Create policy failed')
    });
  }

  loadAdminPayments() {
    this.http.get<any[]>(`${environment.apiUrl}/payments/payments`).subscribe({
      next: (data) => {
        this.adminPayments = data || [];
        this.applyPaymentFilters();
      },
      error: () => {
        this.adminPayments = [];
        this.adminPaymentsFiltered = [];
      }
    });
  }

  applyPaymentFilters() {
    const term = (this.paymentSearch || '').toLowerCase();
    const min = this.paymentMin ?? -Infinity;
    const max = this.paymentMax ?? Infinity;
    this.adminPaymentsFiltered = (this.adminPayments || []).filter((p: any) => {
      const label = `${p.userId?.name || p.userId?.email || ''} ${p.userPolicyId?.policyProductId?.title || ''} ${p.reference || ''}`.toLowerCase();
      return (
        label.includes(term) &&
        (typeof p.amount === 'number' ? p.amount >= min && p.amount <= max : true)
      );
    });
  }
}


