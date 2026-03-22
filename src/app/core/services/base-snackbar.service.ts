import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Snackbar } from '../../shared/components/snackbar/snackbar'; // adjust path

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarData {
  title: string;
  action?: string;
  type?: SnackbarType;
}

@Injectable({
  providedIn: 'root'
})
export class BaseSnackbarService {

  private snackBar = inject(MatSnackBar);

  // 🔹 Base Method (Reusable Everywhere)
  open(message: string, type: SnackbarType = 'info', duration = 5000) {

    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      data: {
        title: message,
        action: 'Dismiss',
        type
      } as SnackbarData
    };

    this.snackBar.openFromComponent(Snackbar, config);
  }

  // 🔹 Helper Methods (Enterprise Pattern)
  success(message: string, duration = 5000) {
    this.open(message, 'success', duration);
  }

  error(message: string, duration = 10000) {
    this.open(message, 'error', duration);
  }

  warning(message: string, duration = 7000) {
    this.open(message, 'warning', duration);
  }

  info(message: string, duration = 5000) {
    this.open(message, 'info', duration);
  }
}