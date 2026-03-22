/**
 * grid-datasource.service.ts
 * ─────────────────────────────────────────────────────────────
 * Builds AG Grid datasources for infinite scroll and server-side.
 *
 * Expects your API to return:  { data: T[], total: number }
 *
 * Usage — infinite scroll:
 *   this.datasourceSvc.buildInfinite<Order>(
 *     (req) => this.http.post<ApiResponse<Order>>('/api/orders/query', req)
 *   );
 *
 * Usage — server-side (enterprise):
 *   this.datasourceSvc.buildServerSide<Product>(
 *     (req) => this.http.post<ApiResponse<Product>>('/api/products/query', req)
 *   );
 */

import { Injectable } from '@angular/core';
import {
  IDatasource,
  IGetRowsParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-community';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  GridRequest,
  GridSortModel,
  GridFilterCondition,
} from './grid-request.model';

/** The function your feature component provides — calls your HttpClient */
export type GridDataFn<T = any> = (request: GridRequest) => Observable<ApiResponse<T>>;

@Injectable({ providedIn: 'root' })
export class GridDatasourceService {

  // ─── Public builders ─────────────────────────────────────────

  /**
   * Build an IDatasource for rowModelType: 'infinite'.
   *
   * @param dataFn     Your HTTP call — must return Observable<ApiResponse<T>>
   * @param searchText Optional quick-filter string (pass a signal/subject value)
   */
  buildInfinite<T = any>(
    dataFn: GridDataFn<T>,
    searchText = ''
  ): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const request = this.toRequest(
          params.startRow,
          params.endRow,
          params.sortModel,
          params.filterModel,
          searchText
        );

        dataFn(request).subscribe({
          // ApiResponse<T> → { data: T[], total: number }
          next:  (res) => params.successCallback(res.data, res.total),
          error: (err) => {
            console.error('[GridDatasourceService] infinite error:', err);
            params.failCallback();
          },
        });
      },
    };
  }

  /**
   * Build an IServerSideDatasource for rowModelType: 'serverSide'.
   * Requires ag-grid-enterprise.
   *
   * @param dataFn     Your HTTP call — must return Observable<ApiResponse<T>>
   * @param searchText Optional quick-filter string
   */
  buildServerSide<T = any>(
    dataFn: GridDataFn<T>,
    searchText = ''
  ): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        const { startRow = 0, endRow = 20, sortModel, filterModel } = params.request;

        const request = this.toRequest(
          startRow,
          endRow,
          sortModel ?? [],
          filterModel ?? {},
          searchText
        );

        dataFn(request).subscribe({
          // ApiResponse<T> → { data: T[], total: number }
          next:  (res) => params.success({ rowData: res.data, rowCount: res.total }),
          error: (err) => {
            console.error('[GridDatasourceService] server-side error:', err);
            params.fail();
          },
        });
      },
    };
  }

  // ─── Shared request builder ───────────────────────────────────

  /**
   * Normalises raw AG Grid params into your clean GridRequest shape.
   * Called internally by both buildInfinite() and buildServerSide().
   */
  private toRequest(
    startRow: number,
    endRow: number,
    sort: { colId: string; sort: string }[],
    filter: Record<string, any>,
    searchText: string
  ): GridRequest {
    const pageSize = endRow - startRow;

    return {
      startRow,
      endRow,
      sortModel:       this.normaliseSortModel(sort),
      filterModel:     this.normaliseFilterModel(filter),
      searchText: searchText,
    };
  }

  // ─── Private helpers ──────────────────────────────────────────

  private normaliseSortModel(
    raw: { colId: string; sort: string }[]
  ): GridSortModel[] {
    return (raw ?? []).map((s) => ({
      colId: s.colId,
      sort:  s.sort as 'asc' | 'desc',
    }));
  }

  private normaliseFilterModel(
    raw: Record<string, any>
  ): Record<string, GridFilterCondition> {
    return Object.fromEntries(
      Object.entries(raw ?? {}).map(([field, condition]) => [
        field,
        condition as GridFilterCondition,
      ])
    );
  }
}