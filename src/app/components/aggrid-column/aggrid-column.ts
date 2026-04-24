import { IOlympicData } from './../../model/iolympic-data';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { SalesRecord } from '../../model/sales-record';
import {
  AutoSizeStrategy,
  ClientSideRowModelModule,
  ColDef,
  ColTypeDefs,
  GridReadyEvent,
  ModuleRegistry,
  ValueFormatterParams,
} from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

@Component({
  selector: 'app-aggrid-column',
  imports: [AgGridAngular],
  templateUrl: './aggrid-column.html',
  styleUrl: './aggrid-column.css',
})
export class AggridColumn {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  // guard so only the first gridReady fires the HTTP call
  private dataLoaded = false;

  defaultColDef: ColDef = {
    width: 150,
    cellStyle: { fontWeight: 'bold' },
  };

  columnDefs: ColDef[] = [{ field: 'athlete' }, { field: 'sport' }, { field: 'age' }];

  columnTypesDef: ColTypeDefs = {
    currency: {
      width: 150,
      valueFormatter: currencyFormatter,
    },
    shaded: {
      cellClass: 'shaded-class',
    },
  };

     autoSizeStrategy: AutoSizeStrategy = {
        type: "fitGridWidth",
      };
      

  columnDataDefs: ColDef[] = [
    { field: 'productName' },
    { field: 'boughtPrice', type: 'currency' },
    { field: 'soldPrice', type: ['currency', 'shaded'] },
  ];

  rowDataDefs: SalesRecord[] | null = [
    { productName: 'Lamp', boughtPrice: 100, soldPrice: 200 },
    { productName: 'Chair', boughtPrice: 150, soldPrice: 300 },
    { productName: 'Desk', boughtPrice: 200, soldPrice: 400 },
  ];

  rowData: IOlympicData[] = [];

  onGridReady(_params: GridReadyEvent<IOlympicData>) {
    if (this.dataLoaded) return;
    this.dataLoaded = true;

    this.http
      .get<IOlympicData[]>('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => (this.rowData = data));
  }
}

function currencyFormatter(params: ValueFormatterParams) {
  const value = Math.floor(params.value);
  if (isNaN(value)) {
    return '';
  }
  return '£' + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
