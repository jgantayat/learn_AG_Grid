import { Component, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { AutoSizeStrategy, ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class TestComponent {
     autoSizeStrategy: AutoSizeStrategy = {
        type: "fitGridWidth",
      };
  engineerRowData = signal([
    { name: 'Alice', role: 'Engineer', score: 92, active: true },
    { name: 'Bob', role: 'Designer', score: 85, active: false },
    { name: 'Carol', role: 'Manager', score: 78, active: true },
    { name: 'David', role: 'Engineer', score: 95, active: true },
    { name: 'Eva', role: 'Analyst', score: 88, active: false },
  ]);

  engineerColDefs = signal<ColDef[]>([
    { field: 'name', headerName: 'Name', sortable: true, filter: true, type: 'rightAligned' },
    { field: 'role', headerName: 'Role', sortable: true, filter: true },
    { field: 'score', headerName: 'Score', sortable: true, filter: 'agNumberColumnFilter', type: 'numericColumn' },
    { field: 'active', headerName: 'Active', valueFormatter: (p) => (p.value ? 'Yes' : 'No') },
  ]);
}
