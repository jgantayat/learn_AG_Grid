import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { _themeAlpineParams, _themeQuartzParams, AllCommunityModule, ModuleRegistry, themeAlpine, themeQuartz } from 'ag-grid-community';
import { AggridColumn } from "./components/aggrid-column/aggrid-column";

ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-root',
  imports: [AgGridAngular, AggridColumn],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('learn_AG_Grid');
  // theme = themeAlpine; 

    rowData = [
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: true },
    ];

    // Column Definitions: Defines the columns to be displayed.
    colDefs: ColDef[] = [
        { 
          field: "make", sortable: true, filter: true, 
          // headerName: "Company",
          // valueGetter: (p) => p.data.make + ' ' + p.data.price
         },
        { 
          field: "model",
           sortable: true,
            filter: true, 
          },
        { 
          field: "price", 
          sortable: true, 
          filter: 'agNumberColumnFilter',
          valueFormatter: (p) => '$' + p.value.toLocaleString() 
         },
        { 
          field: "electric", 
          sortable: false, 
          filter: true,
          cellRenderer: (p: any) => p.value ? '✅' : '❌'
        }
    ];
}
