import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.user$.subscribe((u) => (this.user = u));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
