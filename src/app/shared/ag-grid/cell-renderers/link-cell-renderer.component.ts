import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export interface LinkCellParams {
  href?: (data: any) => string;
  onClick?: (data: any) => void;
  openInNewTab?: boolean;
}

@Component({
  selector: 'app-link-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a
      *ngIf="href; else btnLink"
      [href]="href"
      [target]="openInNewTab ? '_blank' : '_self'"
      class="cell-link"
    >{{ value }}</a>

    <ng-template #btnLink>
      <span class="cell-link" (click)="onClick()">{{ value }}</span>
    </ng-template>
  `,
  styles: [`
    .cell-link {
      color: #1976d2;
      text-decoration: underline;
      cursor: pointer;
      font-size: 13px;
      &:hover { color: #0d47a1; }
    }
  `],
})
export class LinkCellRendererComponent implements ICellRendererAngularComp {
  value = '';
  href: string | null = null;
  openInNewTab = false;
  private params!: ICellRendererParams & LinkCellParams;

  agInit(params: ICellRendererParams & LinkCellParams): void {
    this.params = params;
    this.value = params.value ?? '';
    this.href = params.href ? params.href(params.data) : null;
    this.openInNewTab = params.openInNewTab ?? false;
  }

  refresh(): boolean { return false; }

  onClick(): void {
    this.params.onClick?.(this.params.data);
  }
}
