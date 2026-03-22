import { Injectable } from '@angular/core';
import {
  ColDef,
  GridOptions,
  SideBarDef,
  StatusPanelDef,
  IDatasource,
  IServerSideDatasource,
  GridApi,
} from 'ag-grid-community';
import { CustomHeaderComponent } from '../headers/custom-header.component';
import { ActionCellRendererComponent } from '../cell-renderers/action-cell-renderer.component';

export interface GridAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'warn' | 'accent';
  callback: (rowData: any) => void;
  isVisible?: (rowData: any) => boolean;
  isDisabled?: (rowData: any) => boolean;
}

/**
 * rowModelType:
 *  'clientSide'  → pass [rowData] input (default, no extra setup)
 *  'infinite'    → scroll-triggered loading, provide infiniteDatasource
 *  'serverSide'  → server owns sort/filter/page, provide serverSideDatasource (enterprise only)
 */
export type GridRowModelType = 'clientSide' | 'infinite' | 'serverSide';

export interface GenericGridConfig {
  columnDefs: ColDef[];
  defaultColDef?: ColDef;

  // ── Row model ─────────────────────────────────────────────────
  rowModelType?: GridRowModelType;

  /** Required when rowModelType = 'infinite' */
  infiniteDatasource?: IDatasource;

  /** Required when rowModelType = 'serverSide' (enterprise) */
  serverSideDatasource?: IServerSideDatasource;

  /** Rows per page/block for infinite + server-side */
  cacheBlockSize?: number;

  // ── Selection ─────────────────────────────────────────────────
  rowSelection?: 'single' | 'multiple';

  // ── Pagination (page buttons) ─────────────────────────────────
  pagination?: boolean;
  paginationPageSize?: number;
  paginationPageSizeSelector?: number[];

  /**
   * When true — pagination is disabled and the grid loads more rows
   * as you scroll. Only valid with rowModelType 'infinite' or 'serverSide'.
   */
  infiniteScroll?: boolean;

  // ── UI ────────────────────────────────────────────────────────
  sideBar?: boolean | SideBarDef;
  enableStatusBar?: boolean;
  actions?: GridAction[];
  enableExport?: boolean;
  enableSearch?: boolean;
  gridHeight?: string;
  domLayout?: 'normal' | 'autoHeight' | 'print';
  suppressContextMenu?: boolean;
  animateRows?: boolean;
  rowGroupPanelShow?: 'always' | 'onlyWhenGrouping' | 'never';
  pivotPanelShow?: 'always' | 'onlyWhenPivoting' | 'never';

  /**
   * Callback fired once the grid is ready.
   * Use this to store the GridApi reference inside your component.
   *
   * Example:
   *   gridConfig: GenericGridConfig = {
   *     onGridReady: (api) => this.gridApi = api,
   *     ...
   *   };
   */
  onGridReady?: (api: GridApi) => void;
}

@Injectable({ providedIn: 'root' })
export class GridConfigService {

  getDefaultColDef(overrides: ColDef = {}): ColDef {
    return {
      flex: 1,
      minWidth: 100,
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: false,
      headerComponent: CustomHeaderComponent,
      ...overrides,
    };
  }

  buildGridOptions(config: GenericGridConfig): GridOptions {
    const columnDefs = this.injectActionColumn(config);
    const rowModelType = config.rowModelType ?? 'clientSide';
    const useInfiniteScroll = config.infiniteScroll && rowModelType !== 'clientSide';

    const statusPanels: StatusPanelDef[] = config.enableStatusBar
      ? [
          { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
          { statusPanel: 'agTotalRowCountComponent', align: 'center' },
          { statusPanel: 'agFilteredRowCountComponent' },
          { statusPanel: 'agSelectedRowCountComponent' },
          { statusPanel: 'agAggregationComponent' },
        ]
      : [];

    return {
      columnDefs,
      defaultColDef: this.getDefaultColDef(config.defaultColDef),
      rowModelType,

      // ── Pagination vs infinite scroll ──────────────────────────
      // If infiniteScroll=true we disable page buttons — the grid
      // loads more rows automatically as the user scrolls.
      pagination: useInfiniteScroll ? false : (config.pagination ?? true),
      paginationPageSize: config.paginationPageSize ?? 20,
      paginationPageSizeSelector: config.paginationPageSizeSelector ?? [10, 20, 50, 100],

      // Block size used by infinite + server-side row models
      cacheBlockSize: config.cacheBlockSize ?? config.paginationPageSize ?? 20,

      // ── Other grid options ─────────────────────────────────────
      rowSelection: config.rowSelection ?? 'multiple',
      animateRows: config.animateRows ?? true,
      suppressContextMenu: config.suppressContextMenu ?? false,
      domLayout: config.domLayout ?? 'normal',
      rowGroupPanelShow: config.rowGroupPanelShow ?? 'onlyWhenGrouping',
      pivotPanelShow: config.pivotPanelShow ?? 'onlyWhenPivoting',
      sideBar: config.sideBar ?? this.getDefaultSidebar(),
      statusBar: config.enableStatusBar ? { statusPanels } : undefined,
      suppressMovableColumns: false,
      suppressRowClickSelection: true,
      getRowId: (params) =>
        params.data?.id != null ? String(params.data.id) : JSON.stringify(params.data),
    };
  }

  getDefaultSidebar(): SideBarDef {
    return {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
      ],
      defaultToolPanel: '',
    };
  }

  private injectActionColumn(config: GenericGridConfig): ColDef[] {
    const cols = [...config.columnDefs];
    if (config.actions && config.actions.length > 0) {
      cols.push({
        headerName: 'Actions',
        field: '__actions',
        pinned: 'right',
        lockPinned: true,
        sortable: false,
        filter: false,
        resizable: false,
        suppressMovable: true,
        width: 130,
        cellRenderer: ActionCellRendererComponent,
        cellRendererParams: { actions: config.actions },
      });
    }
    return cols;
  }
}