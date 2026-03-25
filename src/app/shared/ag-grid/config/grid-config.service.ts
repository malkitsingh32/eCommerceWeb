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
import { GridLoadingOverlayComponent } from '../overlays/grid-loading-overlay.component';
import { GridNoRowsOverlayComponent } from '../overlays/grid-no-rows-overlay.component';
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

export interface ToolbarActionButtonConfig {
  label: string;
  title?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  buttonClass?: string;
}

export type GridRowModelType = 'clientSide' | 'infinite' | 'serverSide';

export interface GenericGridConfig {
  columnDefs: ColDef[];
  defaultColDef?: ColDef;

  // ── Row model ─────────────────────────────────────────────────
  rowModelType?: GridRowModelType;
  infiniteDatasource?: IDatasource;
  serverSideDatasource?: IServerSideDatasource;
  cacheBlockSize?: number;

  // ── Selection ─────────────────────────────────────────────────
  rowSelection?: 'single' | 'multiple';

  // ── Pagination ────────────────────────────────────────────────
  pagination?: boolean;
  paginationPageSize?: number;
  paginationPageSizeSelector?: number[];
  infiniteScroll?: boolean;

  // ── Overlay / loader ──────────────────────────────────────────
  /**
   * Custom message shown in the no-rows overlay.
   * Defaults to: 'Try adjusting your filters or search term.'
   */
  noRowsMessage?: string;

  // ── UI ────────────────────────────────────────────────────────
  sideBar?: boolean | SideBarDef;
  enableStatusBar?: boolean;
  actions?: GridAction[];
  enableExport?: boolean;
  enableSearch?: boolean;
  toolbarActionButton?: ToolbarActionButtonConfig;
  gridHeight?: string;
  domLayout?: 'normal' | 'autoHeight' | 'print';
  suppressContextMenu?: boolean;
  animateRows?: boolean;
  rowGroupPanelShow?: 'always' | 'onlyWhenGrouping' | 'never';
  pivotPanelShow?: 'always' | 'onlyWhenPivoting' | 'never';
  onToolbarAction?: () => void;

  // ── Lifecycle ─────────────────────────────────────────────────
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
      pagination: useInfiniteScroll ? false : (config.pagination ?? true),
      paginationPageSize: config.paginationPageSize ?? 20,
      paginationPageSizeSelector: config.paginationPageSizeSelector ?? [10, 20, 50, 100],
      cacheBlockSize: config.cacheBlockSize ?? config.paginationPageSize ?? 20,

      // ── Custom overlays ─────────────────────────────────────────
      // Loading overlay — shown when [loading]=true or grid is fetching
      loadingOverlayComponent: GridLoadingOverlayComponent,

      // No-rows overlay — shown when rowData is empty after load
      noRowsOverlayComponent: GridNoRowsOverlayComponent,
      noRowsOverlayComponentParams: {
        message: config.noRowsMessage ?? 'Try adjusting your filters or search term.',
      },

      // ── Other grid options ──────────────────────────────────────
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
        width: 92,
        minWidth: 88,
        maxWidth: 100,
        cellRenderer: ActionCellRendererComponent,
        cellRendererParams: { actions: config.actions },
      });
    }
    return cols;
  }
}