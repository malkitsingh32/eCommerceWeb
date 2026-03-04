export class PhoneValidator {}
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!control.value) {
      return null;
    }

    const valid = phoneRegex.test(control.value);

    return valid ? null : { invalidPhone: true };
  };
}