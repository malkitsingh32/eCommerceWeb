import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Button } from '../button/button';
import { DialogAction, DialogConfig, DialogResult } from './dialog.types';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, MatDialogModule, Button],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  private readonly dialogRef = inject(MatDialogRef<Dialog, DialogResult>);
  readonly data = inject<DialogConfig>(MAT_DIALOG_DATA);

  readonly actions: DialogAction[] =
    this.data.actions && this.data.actions.length > 0
      ? this.data.actions
      : [
          { id: 'cancel', label: 'Cancel' },
          { id: 'confirm', label: 'Confirm', color: 'primary' },
        ];

  close(): void {
    this.dialogRef.close({
      actionId: 'close',
      payload: this.data.payload,
    });
  }

  chooseAction(action: DialogAction): void {
    this.dialogRef.close({
      actionId: action.id,
      value: action.value,
      payload: this.data.payload,
    });
  }

  getActionVariant(action: DialogAction): 'primary' | 'secondary' | 'danger' {
    if (action.color === 'warn') {
      return 'danger';
    }

    if (action.color === 'accent') {
      return 'secondary';
    }

    return 'primary';
  }
}
