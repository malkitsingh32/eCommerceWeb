import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { Dialog } from './dialog';
import { DialogConfig, DialogResult } from './dialog.types';

export interface ConfirmDialogConfig {
  title: string;
  message?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  disableClose?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(MatDialog);

  open<TPayload = unknown, TValue = unknown>(
    config: DialogConfig<TPayload, TValue>,
    options?: Omit<MatDialogConfig<DialogConfig<TPayload, TValue>>, 'data'>
  ): MatDialogRef<Dialog, DialogResult<TValue, TPayload>> {
    return this.dialog.open(Dialog, {
      width: '460px',
      maxWidth: '95vw',
      autoFocus: false,
      restoreFocus: true,
      disableClose: config.disableClose ?? false,
      data: config,
      ...options,
    });
  }

  confirm(config: ConfirmDialogConfig): Observable<boolean> {
    const ref = this.open({
      title: config.title,
      message: config.message,
      description: config.description,
      disableClose: config.disableClose,
      actions: [
        {
          id: 'cancel',
          label: config.cancelText ?? 'Cancel',
          variant: 'stroked',
          value: false,
        },
        {
          id: 'confirm',
          label: config.confirmText ?? 'Confirm',
          color: 'primary',
          variant: 'raised',
          value: true,
        },
      ],
    });

    return ref.afterClosed().pipe(
      map((result) => result?.actionId === 'confirm' || result?.value === true)
    );
  }
}
