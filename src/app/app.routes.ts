import { Routes } from '@angular/router';

/* Rutas de la aplicación. Cada página se carga de forma diferida (lazy loading). */
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'gestion-citas',
    loadComponent: () =>
      import('./pages/gestion-citas/gestion-citas.page').then((m) => m.GestionCitasPage),
  },
  {
    path: 'configuracion',
    loadComponent: () =>
      import('./pages/configuracion/configuracion.page').then((m) => m.ConfiguracionPage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
