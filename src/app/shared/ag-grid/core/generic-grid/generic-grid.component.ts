import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  GridApi,
  GridReadyEvent,
  SelectionChangedEvent,
  RowDoubleClickedEvent,
  CellValueChangedEvent,
  GridOptions,
  FilterChangedEvent,
  SortChangedEvent,
  CsvExportParams,
} from 'ag-grid-community';
import { GridToolbarComponent } from '../grid-toolbar/grid-toolbar.component';
import { GenericGridConfig, GridConfigService } from '../../config/grid-config.service';

@Component({
  selector: 'app-generic-grid',
  standalone: true,
  imports: [AgGridAngular, GridToolbarComponent],
  templateUrl: './generic-grid.component.html',
  styleUrls: ['./generic-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericGridComponent implements OnChanges {
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  @Input() config!: GenericGridConfig;

  /**
   * Row data for clientSide mode.
   * Leave empty / omit when using rowModelType 'infinite' or 'serverSide'.
   */
  @Input() rowData: any[] = [];

  @Input() loading = false;
  @Input() title = '';

  /**
   * Emits the GridApi once the grid is initialised.
   * You can either:
   *   (a) listen via (gridReady)="onGridReady($event)" in the template, OR
   *   (b) pass config.onGridReady = (api) => this.gridApi = api
   * Both work — use whichever suits your component style.
   */
  @Output() gridReady = new EventEmitter<GridApi>();
  @Output() selectionChanged = new EventEmitter<any[]>();
  @Output() rowDoubleClicked = new EventEmitter<any>();
  @Output() cellValueChanged = new EventEmitter<CellValueChangedEvent>();
  @Output() filterChanged = new EventEmitter<FilterChangedEvent>();
  @Output() sortChanged = new EventEmitter<SortChangedEvent>();

  gridOptions!: GridOptions;
  private gridApi!: GridApi;

  // ── Template helpers (avoids NG8107 optional-chain warnings) ──
  get gridHeight(): string  { return this.config?.gridHeight  ?? '500px'; }
  get toolbarSearch(): boolean { return this.config?.enableSearch ?? true; }
  get toolbarExport(): boolean { return this.config?.enableExport ?? true; }
  get toolbarActionButton() { return this.config?.toolbarActionButton; }

  constructor(private gridConfigService: GridConfigService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.gridOptions = this.gridConfigService.buildGridOptions(this.config);
    }
  }

  // ─── onGridReady ─────────────────────────────────────────────────────────
  // This is the single place where GridApi is captured.
  // After capturing it we:
  //   1. Emit it via (gridReady) output so feature components can store it.
  //   2. Call config.onGridReady(api) if the feature component provided it inline.
  //   3. Wire up the datasource for infinite / server-side row models.
  // ─────────────────────────────────────────────────────────────────────────
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    // (a) Output event — for (gridReady)="fn($event)" in template
    this.gridReady.emit(params.api);

    // (b) Inline callback — for config.onGridReady = (api) => ...
    this.config?.onGridReady?.(params.api);

    // (c) Wire datasources
    const { rowModelType, infiniteDatasource, serverSideDatasource } = this.config ?? {};

    if (rowModelType === 'infinite' && infiniteDatasource) {
      params.api.setGridOption('datasource', infiniteDatasource);
    }

    if (rowModelType === 'serverSide' && serverSideDatasource) {
      params.api.setGridOption('serverSideDatasource', serverSideDatasource);
    }

    params.api.sizeColumnsToFit();
  }

  // ─── Other grid events ────────────────────────────────────────────────────

  onSelectionChanged(_: SelectionChangedEvent): void {
    this.selectionChanged.emit(this.gridApi.getSelectedRows());
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent): void {
    this.rowDoubleClicked.emit(event.data);
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    this.cellValueChanged.emit(event);
  }

  onFilterChanged(event: FilterChangedEvent): void {
    this.filterChanged.emit(event);
  }

  onSortChanged(event: SortChangedEvent): void {
    this.sortChanged.emit(event);
  }

  // ─── Toolbar actions ──────────────────────────────────────────────────────

  onSearchChange(value: string): void {
    this.gridApi?.setGridOption('quickFilterText', value);
  }

  exportCsv(params?: CsvExportParams): void {
    this.gridApi?.exportDataAsCsv(params);
  }

  exportExcel(): void {
    (this.gridApi as any)?.exportDataAsExcel?.();
  }

  refreshGrid(): void {
    this.gridApi?.refreshCells({ force: true });
  }

  clearFilters(): void {
    this.gridApi?.setFilterModel(null);
  }

  autoSizeAllColumns(): void {
    this.gridApi?.autoSizeAllColumns();
  }

  onToolbarAction(): void {
    this.config?.onToolbarAction?.();
  }

  // ─── Public API (accessible via @ViewChild) ───────────────────────────────

  getGridApi(): GridApi { return this.gridApi; }
  getSelectedRows(): any[] { return this.gridApi?.getSelectedRows() ?? []; }

  applyTransaction(tx: { add?: any[]; update?: any[]; remove?: any[] }): void {
    this.gridApi?.applyTransaction(tx);
  }

  /** Refresh server-side / infinite rows from scratch */
  refreshServerSide(): void {
    this.gridApi?.refreshServerSide?.({ purge: true });
  }

  /** Purge and reload all infinite cache blocks */
  purgeInfiniteCache(): void {
    this.gridApi?.purgeInfiniteCache?.();
  }
}