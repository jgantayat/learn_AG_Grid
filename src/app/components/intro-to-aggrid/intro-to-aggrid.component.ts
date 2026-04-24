import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AggridColumn } from '../aggrid-column/aggrid-column';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-intro-to-aggrid',
  standalone: true,
  imports: [AgGridAngular, AggridColumn],
  templateUrl: './intro-to-aggrid.component.html',
  styleUrl: './intro-to-aggrid.component.css',
})
export class IntroToAggridComponent {
  rowData = [
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: true },
  ];

  colDefs: ColDef[] = [
    { field: 'make', sortable: true, filter: true },
    { field: 'model', sortable: true, filter: true },
    {
      field: 'price',
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: (p) => '$' + p.value.toLocaleString(),
    },
    {
      field: 'electric',
      sortable: false,
      filter: true,
      cellRenderer: (p: any) => (p.value ? '✅' : '❌'),
    },
  ];
}
