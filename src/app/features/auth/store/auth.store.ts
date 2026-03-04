import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  user = signal<User | null>(null);
  loading = signal(false);
  isLoggedIn = signal(false);

}