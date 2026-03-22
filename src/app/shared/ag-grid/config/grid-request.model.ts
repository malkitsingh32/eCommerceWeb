/**
 * grid-request.model.ts
 * ─────────────────────────────────────────────────────────────
 * Shared request/response types for both infinite and server-side.
 */

// ── Sort & filter types ──────────────────────────────────────

export interface GridSortModel {
  colId: string;
  sort: 'asc' | 'desc';
}

export interface GridFilterCondition {
  filterType: 'text' | 'number' | 'date' | 'set';
  type?: string;
  filter?: any;
  filterTo?: any;
  values?: any[];
  dateFrom?: string;
  dateTo?: string;
  operator?: 'AND' | 'OR';
  conditions?: GridFilterCondition[];
}

// ── Outgoing request sent to your API ────────────────────────

export interface GridRequest {
  startRow: number;
  endRow: number;      // 0-based page index
  sortModel: GridSortModel[];
  filterModel: Record<string, GridFilterCondition>;
  searchText?: string;
}

// ── Your existing API response model ─────────────────────────
// Shape: { data: T[], total: number }
// This is the only response shape the service understands.
// T is the row type (e.g. Order, Product, User).

export interface ApiResponse<T = any> {
  data: T[];
  total: number;
}