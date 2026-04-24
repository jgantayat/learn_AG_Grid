import { Component, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { AutoSizeStrategy, ColDef, ColTypeDefs, ValueFormatterParams } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const currencyFormatter = (params: ValueFormatterParams) =>
  params.value != null ? '$' + params.value.toLocaleString() : '';

const percentFormatter = (params: ValueFormatterParams) =>
  params.value != null ? params.value.toFixed(1) + '%' : '';

@Component({
  selector: 'app-column-types',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './column-types.html',
  styleUrl: './column-types.css',
})
export class ColumnTypesComponent {

   autoSizeStrategy: AutoSizeStrategy = {
      type: "fitGridWidth",
    };
  columnTypes: ColTypeDefs = {
    currency: {
      valueFormatter: currencyFormatter,
      filter: 'agNumberColumnFilter',
      sortable: true,
      width: 140,
    },
    percentage: {
      valueFormatter: percentFormatter,
      filter: 'agNumberColumnFilter',
      sortable: true,
      width: 130,
    },
    label: {
      sortable: true,
      filter: true,
      width: 160,
    },
  };

  rowData = signal([
    { product: 'Laptop Pro', category: 'Electronics', revenue: 128000, margin: 34.5, units: 320 },
    { product: 'Office Chair', category: 'Furniture', revenue: 47500, margin: 52.1, units: 190 },
    { product: 'Standing Desk', category: 'Furniture', revenue: 93200, margin: 41.8, units: 155 },
    {
      product: 'Wireless Mouse',
      category: 'Electronics',
      revenue: 18600,
      margin: 61.3,
      units: 620,
    },
    { product: 'Monitor 27"', category: 'Electronics', revenue: 74400, margin: 28.9, units: 248 },
  ]);

  colDefs = signal<ColDef[]>([
    { field: 'product', type: 'label', headerName: 'Product' },
    { field: 'category', type: 'label', headerName: 'Category' },
    { field: 'revenue', type: 'currency', headerName: 'Revenue' },
    { field: 'margin', type: 'percentage', headerName: 'Margin %' },
    {
      field: 'units',
      headerName: 'Units Sold',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 120,
    },
  ]);


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
