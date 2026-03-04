import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleApiError(error: HttpErrorResponse) {

  let errorMessage = 'Something went wrong';

  if (error.error) {

    if (error.error.errors) {
      errorMessage = error.error.errors.join(',');
    }

    if (error.error.messages) {
      errorMessage = error.error.messages.join(',');
    }

  }

  console.error('API ERROR:', error);

  return throwError(() => errorMessage);
}