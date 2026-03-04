import { HttpInterceptorFn } from '@angular/common/http';
import { retry } from 'rxjs/operators';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(

    retry({
      count: 2,
      delay: 1000
    })

  );

};