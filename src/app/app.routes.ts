import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadComponent: () =>
  //     import('./shared/components/layouts/layouts').then((m) => m.Layouts),
  //   },
   {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
