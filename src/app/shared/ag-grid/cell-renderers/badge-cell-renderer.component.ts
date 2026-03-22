import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export interface BadgeCellParams {
  colorMap?: Record<string, string>;
  defaultColor?: string;
  uppercase?: boolean;
}

@Component({
  selector: 'app-badge-cell-renderer',
  standalone: true,
  template: `
    <span class="badge" [style.background-color]="bgColor">
      {{ displayValue }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #fff;
      white-space: nowrap;
    }
  `],
})
export class BadgeCellRendererComponent implements ICellRendererAngularComp {
  bgColor = '#607d8b';
  displayValue = '';

  agInit(params: ICellRendererParams & BadgeCellParams): void {
    const value = params.value ?? '';
    this.displayValue = params.uppercase ? String(value).toUpperCase() : String(value);
    this.bgColor = params.colorMap?.[value] ?? params.defaultColor ?? '#607d8b';
  }

  refresh(): boolean { return false; }
}
