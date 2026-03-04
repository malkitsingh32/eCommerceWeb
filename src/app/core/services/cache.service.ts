import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cache = new Map<string, any>();

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, data: any) {
    this.cache.set(key, data);
  }

  clear(key?: string) {

    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }

  }

}