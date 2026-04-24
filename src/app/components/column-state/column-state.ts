import { Component, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { AutoSizeStrategy, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { IOlympicData } from '../../model/iolympic-data';
import { HttpClient } from '@angular/common/http';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-column-state',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './column-state.html',
  styleUrl: './column-state.css',
})
export class ColumnStateComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "sport" },
  ];
  autoSizeStrategy: AutoSizeStrategy = {
    type: "fitGridWidth",
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtSortAthlete() {
    this.gridApi.applyColumnState({
      state: [{ colId: "athlete", sort: "asc" }],
    });
  }

  onBtClearAllSorting() {
    this.gridApi.applyColumnState({
      defaultState: { sort: null },
    });
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
