import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    if (value.length < 8) {
      errors['minLength'] = true;
    }
    if (!/[A-Z]/.test(value)) {
      errors['noUpperCase'] = true;
    }
    if (!/[a-z]/.test(value)) {
      errors['noLowerCase'] = true;
    }
    if (!/[0-9]/.test(value)) {
      errors['noNumber'] = true;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors['noSpecialChar'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}