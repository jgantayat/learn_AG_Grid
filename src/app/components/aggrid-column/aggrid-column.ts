import { IOlympicData } from './../../model/iolympic-data';
import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {SalesRecord} from "../../model/sales-record";
import { 
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDefs,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule, 
  ValueFormatterParams} from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
]);
@Component({
  selector: 'app-aggrid-column',
  imports: [AgGridAngular],
  templateUrl: './aggrid-column.html',
  styleUrl: './aggrid-column.css',
})
export class AggridColumn {

  defaultColDef: ColDef = {
    width: 150,
    cellStyle: { fontWeight: 'bold' },
  };

    columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "sport" },
    { field: "age" },
  ];

  columnTypesDef: ColTypeDefs = {
    currency: {
      width: 150,
      valueFormatter: currencyFormatter,
    },
    shaded: {
      cellClass: "shaded-class", //thjis shadding .css class property class is not working, need to check ag-grid documentation for this issue
    },
  };

    columnDataDefs: ColDef[] = [
    { field: "productName" },
    // uses properties from currency type
    { field: "boughtPrice", type: "currency" },
    // uses properties from currency AND shaded types
    { field: "soldPrice", type: ["currency", "shaded"] },
  ];

    rowDataDefs: SalesRecord[] | null = [
    { productName: "Lamp", boughtPrice: 100, soldPrice: 200 },
    { productName: "Chair", boughtPrice: 150, soldPrice: 300 },
    { productName: "Desk", boughtPrice: 200, soldPrice: 400 },
  ];

  rowData: IOlympicData[] = [];


  constructor(private http: HttpClient) {
  }

    onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }

}

   function currencyFormatter(params: ValueFormatterParams) {
  const value = Math.floor(params.value);
  if (isNaN(value)) {
    return "";
  }
  return "£" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}