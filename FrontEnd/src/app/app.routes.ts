import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { Policy } from './pages/policy/policy';
import { Login } from './pages/login/login';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: Home 
  },
  { 
    path: 'home', 
    redirectTo: '', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard] // Protect dashboard route
  },
  { 
    path: 'policy', 
    component: Policy 
  },
  { 
    path: 'login', 
    component: Login,
    canActivate: [guestGuard] // Redirect to dashboard if already logged in
  },
  { 
    path: '**', 
    redirectTo: '' 
  } // Wildcard route for 404 page
];