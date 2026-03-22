import { Injectable, signal } from '@angular/core';
import { Product } from '../models/products.model';


@Injectable({
  providedIn: 'root'
})
export class ProductStore {

  product = signal<Product | null>(null);
  loading = signal(false);
  isLoggedIn = signal(false);

}