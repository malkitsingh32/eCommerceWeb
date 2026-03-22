import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { GridAction } from '../config/grid-config.service';


@Component({
  selector: 'app-action-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="action-cell">
      <ng-container *ngFor="let action of visibleActions">
        <button
          class="action-btn"
          [class]="'action-btn--' + (action.color ?? 'primary')"
          [disabled]="isDisabled(action)"
          [title]="action.label"
          (click)="onAction(action)"
        >
          <span *ngIf="action.icon">{{ action.icon }}</span>
          <span *ngIf="!action.icon">{{ action.label }}</span>
        </button>
      </ng-container>
    </div>
  `,
  styles: [`
    .action-cell {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 100%;
    }
    .action-btn {
      padding: 3px 8px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 12px;
      transition: opacity 0.2s;
    }
    .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .action-btn--primary { background: #1976d2; color: #fff; }
    .action-btn--warn    { background: #e53935; color: #fff; }
    .action-btn--accent  { background: #43a047; color: #fff; }
  `],
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams & { actions: GridAction[] };
  visibleActions: GridAction[] = [];

  agInit(params: ICellRendererParams & { actions: GridAction[] }): void {
    this.params = params;
    this.visibleActions = (params.actions ?? []).filter(
      (a) => !a.isVisible || a.isVisible(params.data)
    );
  }

  refresh(): boolean { return false; }

  onAction(action: GridAction): void {
    action.callback(this.params.data);
  }

  isDisabled(action: GridAction): boolean {
    return action.isDisabled ? action.isDisabled(this.params.data) : false;
  }
}