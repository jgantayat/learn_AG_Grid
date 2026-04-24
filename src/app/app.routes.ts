import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./app').then((m) => m.App),
  },
  {
    path: 'basic-grid',
    loadComponent: () =>
      import('./components/basic-grid/basic-grid.component').then((m) => m.BasicGridComponent),
  },
  {
    path: 'intro-to-aggrid',
    loadComponent: () =>
      import('./components/intro-to-aggrid/intro-to-aggrid.component').then(
        (m) => m.IntroToAggridComponent,
      ),
  },
  {
    path: 'column-definitions',
    loadComponent: () =>
      import('./components/aggrid-column/aggrid-column').then((m) => m.AggridColumn),
  },
];
