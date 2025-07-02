import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { Policy } from './pages/policy/policy';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'policy', component: Policy },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' } // Wildcard route for 404 page
];