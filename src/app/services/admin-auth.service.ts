import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly sessionKey = 'mk-studio-admin-auth';

  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.sessionKey) === 'true';
  }

  login(password: string): boolean {
    if (password === environment.adminPassword) {
      sessionStorage.setItem(this.sessionKey, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(this.sessionKey);
  }
}
