import { Routes } from '@angular/router';
import { Products } from './components/products/products';

export const productRoutes: Routes = [

  { path: '', redirectTo: 'products', pathMatch: 'full' },

  {
    path: 'products',
    component: Products
  },
 ];