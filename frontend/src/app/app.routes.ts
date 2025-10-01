import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard, adminGuard } from './services/auth.guard';

import { ClaimsComponent } from './pages/claims/claims.component';
import { MyPoliciesComponent } from './pages/my-policies/my-policies.component';
import { BrowsePoliciesComponent } from './pages/browse-policies/browse-policies.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
    {
    path: 'dashboard',
    component: DashboardComponent,
    
    children: [
      { path: 'browse-policies', component: BrowsePoliciesComponent },
      { path: 'my-policies', component: MyPoliciesComponent },
      { path: 'claims', component: ClaimsComponent },
      // you can add payments etc. here
    ]
  },
  // { path: 'claims', component: ClaimsComponent, canActivate: [authGuard] },
  // { path: 'my-policies', component: MyPoliciesComponent, canActivate: [authGuard] },
  // { path: 'browse-policies', component: BrowsePoliciesComponent, canActivate: [authGuard] },
  { path: 'payments', component: PaymentsComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },

  { path: '**', redirectTo: 'login' }                   // ✅ keep at the very end
];


// Standalone app uses provideRouter in main.ts; no NgModule needed.
