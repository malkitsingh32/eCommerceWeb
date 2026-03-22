import {  Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { AuthStore } from "../store/auth.store";
import { LoginRequest } from "../models/login.model";
import { RegisterRequest } from "../models/register.model";
import { Router } from "@angular/router";
import { BaseSnackbarService } from "../../../core/services/base-snackbar.service";
import { AuthStorageService } from "../../../core/services/auth-storage.service";
import { SafeUser, extractSafeUser } from "../models/safe-user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  constructor(
    private authService: AuthService,
    private store: AuthStore,
    private authStorage: AuthStorageService,
    private router: Router,
    private snakbar: BaseSnackbarService
  ) {
    const user = this.authStorage.getUser<SafeUser>();
    const token = this.authStorage.getToken();

    if (user && token) {
      this.store.user.set(user as any);
      this.store.isLoggedIn.set(true);
    }
  }

  login(payload: LoginRequest) {
    this.store.loading.set(true);
    this.authService.login(payload).subscribe({
      next: (res) => {
        if (res.succeeded && res.data?.token) {
          // Only store safe user data (no phone, firstName, lastName, token expiry)
          const safeUser = extractSafeUser(res.data);
          this.authStorage.setSession(safeUser, res.data.token);
          this.store.user.set(safeUser as any);
          this.store.isLoggedIn.set(true);
          this.router.navigate(['/']);
          this.snakbar.success(res.messages[0] || 'Login successful!');
          return;
        }

        this.snakbar.error(res.messages[0] || 'Login failed');
      },
      error: () => {
        this.store.loading.set(false);
        this.snakbar.error('Login failed');
      },
      complete: () => {
        this.store.loading.set(false);
      }
    });

  }

  register(payload: RegisterRequest) {
    this.store.loading.set(true);
    this.authService.register(payload).subscribe({
      next: (res) => {
        if (res.succeeded) {
          this.store.user.set(res.data);
          this.router.navigate(['/login']);
          this.snakbar.success(res.messages[0] || 'Registration successful! Please log in.');
          return;
        }

        this.snakbar.error(res.messages[0] || 'Registration failed');
      },
      error: () => {
        this.store.loading.set(false);
        this.snakbar.error('Registration failed');
      },
      complete: () => {
        this.store.loading.set(false);
      }
    });
  }

  logout() {
    this.authStorage.clearSession();
    this.store.user.set(null);
    this.store.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

}