export type DialogActionColor = 'primary' | 'accent' | 'warn';
export type DialogActionVariant = 'flat' | 'stroked' | 'raised';

export interface DialogAction<TValue = unknown> {
  id: string;
  label: string;
  color?: DialogActionColor;
  variant?: DialogActionVariant;
  value?: TValue;
  disabled?: boolean;
}

export interface DialogConfig<TPayload = unknown, TValue = unknown> {
  title: string;
  message?: string;
  description?: string;
  payload?: TPayload;
  actions?: DialogAction<TValue>[];
  showCloseButton?: boolean;
  disableClose?: boolean;
}

export interface DialogResult<TValue = unknown, TPayload = unknown> {
  actionId: string;
  value?: TValue;
  payload?: TPayload;
}
