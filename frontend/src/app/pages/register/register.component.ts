import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.name || !this.email || !this.password) {
      this.error = 'All fields are required';
      return;
    }

    // ✅ now only pass name, email, password
    this.authService.register(this.name, this.email, this.password)
      .subscribe({
        next: () => {
          this.success = 'Registration successful! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Registration failed';
        }
      });
  }
}
