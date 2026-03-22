import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export interface CheckboxCellParams {
  disabled?: boolean;
  onChange?: (value: boolean, data: any) => void;
}

@Component({
  selector: 'app-checkbox-cell-renderer',
  standalone: true,
  template: `
    <input
      type="checkbox"
      [checked]="value"
      [disabled]="disabled"
      (change)="onChange($event)"
      style="cursor: pointer; width: 16px; height: 16px;"
    />
  `,
})
export class CheckboxCellRendererComponent implements ICellRendererAngularComp {
  value = false;
  disabled = false;
  private params!: ICellRendererParams & CheckboxCellParams;

  agInit(params: ICellRendererParams & CheckboxCellParams): void {
    this.params = params;
    this.value = !!params.value;
    this.disabled = params.disabled ?? false;
  }

  refresh(params: ICellRendererParams & CheckboxCellParams): boolean {
    this.value = !!params.value;
    return true;
  }

  onChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.value = checked;
    this.params.node.setDataValue(this.params.column!.getId(), checked);
    this.params.onChange?.(checked, this.params.data);
  }
}
