import { Injectable, signal } from '@angular/core';
import { Product } from '../models/products.model';


@Injectable({
  providedIn: 'root'
})
export class ProductStore {

  products = signal<Product[]>([]);
  product = signal<Product | null>(null);
  selectedProduct = signal<Product | null>(null);
  totalRecords = signal(0);
  loading = signal(false);
  isLoggedIn = signal(false);

}