import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login.model';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { RegisterRequest } from '../models/register.model';
import { User } from '../models/user.model';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: BaseHttpService) {}

  login(data: LoginRequest) {
    return this.api.post<User>(API_ENDPOINTS.AUTH.LOGIN, data);
  }

  register(data: RegisterRequest) {
    return this.api.post<User>(API_ENDPOINTS.AUTH.REGISTER, data);
  }
}