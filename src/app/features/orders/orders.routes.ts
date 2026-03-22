import { Routes } from '@angular/router';
import { Orders } from './components/orders/orders';

export const ordersRoutes: Routes = [

  { path: '', redirectTo: 'orders', pathMatch: 'full' },

  {
    path: 'orders',
    component: Orders
  },
 ];