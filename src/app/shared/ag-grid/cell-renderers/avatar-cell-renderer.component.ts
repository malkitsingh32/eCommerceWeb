import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-avatar-cell-renderer',
  standalone: true,
  template: `
    <div class="avatar-cell">
      <div class="avatar" [style.background-color]="bgColor">{{ initials }}</div>
      <span class="avatar-label">{{ label }}</span>
    </div>
  `,
  styles: [`
    .avatar-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 100%;
    }
    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
    }
    .avatar-label { font-size: 13px; }
  `],
})
export class AvatarCellRendererComponent implements ICellRendererAngularComp {
  initials = '';
  label = '';
  bgColor = '#1976d2';

  private readonly COLORS = [
    '#e53935','#8e24aa','#1e88e5','#00897b',
    '#43a047','#fb8c00','#6d4c41','#546e7a',
  ];

  agInit(params: ICellRendererParams): void {
    this.label = params.value ?? '';
    const parts = String(this.label).split(' ').filter(Boolean);
    this.initials = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : String(this.label).substring(0, 2).toUpperCase();
    const idx = Math.abs(this.hashCode(this.label)) % this.COLORS.length;
    this.bgColor = this.COLORS[idx];
  }

  refresh(): boolean { return false; }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }
}
