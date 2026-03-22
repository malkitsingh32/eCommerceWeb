import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';

export const dashboardRoutes: Routes = [

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    component: Dashboard
  },
 ];