import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private cancelSubject = new Subject<void>();

  cancelPendingRequests() {
    this.cancelSubject.next();
  }

  get cancel$() {
    return this.cancelSubject.asObservable();
  }

}