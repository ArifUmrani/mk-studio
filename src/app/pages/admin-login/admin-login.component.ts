import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  password = '';
  error = '';

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {
    if (this.adminAuthService.isAuthenticated()) {
      this.router.navigate(['/admin/orders']);
    }
  }

  login(): void {
    this.error = '';
    if (!this.password.trim()) {
      this.error = 'Please enter the admin password.';
      return;
    }

    if (this.adminAuthService.login(this.password.trim())) {
      this.router.navigate(['/admin/orders']);
      return;
    }

    this.error = 'Incorrect password. Please try again.';
  }
}
