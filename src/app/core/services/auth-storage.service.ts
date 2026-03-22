import { Injectable } from '@angular/core';
import { SafeUser } from '../../features/auth/models/safe-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  /**
   * SECURITY NOTE: Only store non-sensitive data in localStorage
   * Never store: passwords, full names, phone numbers, addresses, SSN, credit cards
   * Only store: userId, username/email, display name (if needed)
   */

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setUser<T>(user: T): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const data = localStorage.getItem(this.USER_KEY);
    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as T;
    } catch {
      this.removeUser();
      return null;
    }
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  setSession<T>(user: T, token: string): void {
    this.setToken(token);
    this.setUser(user);
  }

  clearSession(): void {
    this.removeToken();
    this.removeUser();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
