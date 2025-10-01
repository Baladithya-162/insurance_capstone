import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments() {
    this.http.get<any[]>(`${environment.apiUrl}/payments/payments/user`).subscribe({
      next: (data) => (this.payments = data || []),
      error: (err) => (this.error = err.error?.message || 'Failed to load payments'),
    });
  }
}





