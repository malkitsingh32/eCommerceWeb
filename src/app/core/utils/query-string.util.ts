import { HttpParams } from '@angular/common/http';

export function buildQueryParams(query?: any): HttpParams {

  let params = new HttpParams();
  if (!query) return params;
  Object.keys(query).forEach(key => {
    const value = query[key];
    if (value !== null && value !== undefined) {
      params = params.append(key, value);
    }
  });
  return params;
}