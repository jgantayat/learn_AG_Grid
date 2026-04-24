import { Component, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-basic-grid',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './basic-grid.component.html',
  styleUrl: './basic-grid.component.css',
})
export class BasicGridComponent {
  rowData = signal([
    { name: 'Alice Johnson', department: 'Engineering', salary: 95000, fullTime: true },
    { name: 'Bob Smith', department: 'Design', salary: 78000, fullTime: true },
    { name: 'Carol White', department: 'Marketing', salary: 65000, fullTime: false },
    { name: 'David Brown', department: 'Engineering', salary: 105000, fullTime: true },
    { name: 'Eva Martinez', department: 'HR', salary: 60000, fullTime: false },
  ]);

  colDefs = signal<ColDef[]>([
    { field: 'name', headerName: 'Name' },
    { field: 'department', headerName: 'Department' },
    {
      field: 'salary',
      headerName: 'Salary',
      valueFormatter: (p) => '$' + p.value.toLocaleString(),
    },
    { field: 'fullTime', headerName: 'Full Time', valueFormatter: (p) => (p.value ? 'Yes' : 'No') },
  ]);
}
