import { Injectable } from "@angular/core";
import { TokenService } from "../../../core/services/token.service";
import { AuthService } from "../services/auth.service";
import { AuthStore } from "../store/auth.store";
import { LoginRequest } from "../models/login.model";
import { RegisterRequest } from "../models/register.model";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {

  constructor(
    private authService: AuthService,
    private store: AuthStore,
    private tokenService: TokenService,
    private router: Router
  ) {}

  login(payload: LoginRequest) {
    this.store.loading.set(true);
    this.authService.login(payload).subscribe(res => {
      if (res.succeeded) {
        this.tokenService.setToken(res.data.token);
        this.store.user.set(res.data);
        this.store.isLoggedIn.set(true);
      }
      this.store.loading.set(false);
    });

  }

  register(payload: RegisterRequest) {
    this.store.loading.set(true);
    this.authService.register(payload).subscribe(res => {
      if (res.succeeded) {
        this.store.user.set(res.data);
        this.router.navigate(['/auth/login']);
      }
      this.store.loading.set(false);
    });
  }

  logout() {
    this.tokenService.removeToken();
    this.store.user.set(null);
    this.store.isLoggedIn.set(false);
  }

}