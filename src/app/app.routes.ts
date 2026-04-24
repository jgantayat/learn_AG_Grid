import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then((m) => m.HomeComponent),
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
  {
    path: 'column-types',
    loadComponent: () =>
      import('./components/column-types/column-types').then((m) => m.ColumnTypesComponent),
  },
  {
    path: 'test',
    loadComponent: () => import('./components/test/test').then((m) => m.TestComponent),
  },
  {
    path: 'column-state',
    loadComponent: () =>
      import('./components/column-state/column-state').then((m) => m.ColumnStateComponent),
  },
];
