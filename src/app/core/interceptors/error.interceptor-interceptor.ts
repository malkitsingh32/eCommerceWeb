import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(

    catchError((error) => {

      console.error('API Error:', error);

      if (error.status === 401) {
        console.log('Unauthorized');
      }

      if (error.status === 500) {
        console.log('Server error');
      }

      return throwError(() => error);

    })

  );

};