import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, takeUntil, tap } from 'rxjs';
import { ApiResponse } from '../models/common/api-response';
import { buildQueryParams } from '../utils/query-string.util';
import { handleApiError } from './api-error.handler';
import { CacheService } from './cache.service';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {

  constructor(
    private http: HttpClient,
    private cache: CacheService,
    private requestService: RequestService
  ) {}

  /**
   * GET
   */
  get<T>(
    url: string,
    query?: any,
    useCache: boolean = false
  ): Observable<ApiResponse<T>> {

    const params = buildQueryParams(query);

    const cacheKey = url + JSON.stringify(query);

    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return of(cached);
      }
    }

    return this.http
      .get<ApiResponse<T>>(url, { params })
      .pipe(
        takeUntil(this.requestService.cancel$),
        tap(res => {
          if (useCache) {
            this.cache.set(cacheKey, res);
          }
        }),
        catchError(handleApiError)
      );
  }

  /**
   * POST
   */
  post<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(url, body)
      .pipe(
        catchError(handleApiError)
      );
  }

  /**
   * PUT
   */
  put<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.http
      .put<ApiResponse<T>>(url, body)
      .pipe(
        catchError(handleApiError)
      );
  }

  /**
   * PATCH
   */
  patch<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.http
      .patch<ApiResponse<T>>(url, body)
      .pipe(
        catchError(handleApiError)
      );
  }

  /**
   * DELETE
   */
  delete<T>(url: string): Observable<ApiResponse<T>> {
    return this.http
      .delete<ApiResponse<T>>(url)
      .pipe(
        catchError(handleApiError)
      );
  }

  /**
   * Cancel all pending requests
   */
  cancelRequests() {
    this.requestService.cancelPendingRequests();
  }

  /**
   * Clear cache
   */
  clearCache(key?: string) {
    this.cache.clear(key);
  }

}