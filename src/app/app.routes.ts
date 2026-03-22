import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/layouts/layouts').then((m) => m.Layouts),
    children: [
      { path: '', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes) },
      { path: '', loadChildren: () => import('./features/products/products.routes').then(m => m.productRoutes) },
      { path: '', loadChildren: () => import('./features/orders/orders.routes').then(m => m.ordersRoutes) },
    ]
  },
  {
    path: '',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];