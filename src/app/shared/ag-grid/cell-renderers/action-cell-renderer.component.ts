import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { GridAction } from '../config/grid-config.service';
import { Button } from '../../components/button/button';


@Component({
  selector: 'app-action-cell-renderer',
  standalone: true,
  imports: [CommonModule, Button],
  template: `
    <div class="action-cell">
      @for (action of visibleActions; track $index) {
        <app-button
          materialStyle="flat"
          type="button"
          buttonClass="action-btn-grid"
          [variant]="toVariant(action.color)"
          [disabled]="isDisabled(action)"
          [title]="action.label"
          [fullWidth]="false"
          [label]="action.icon ? action.icon : action.label"
          (clicked)="onAction(action)"
        ></app-button>
      }
    </div>
  `,
  styles: [`
    .action-cell {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 100%;
    }
    .action-cell app-button {
      display: inline-flex;
    }
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

  toVariant(color: GridAction['color']): 'primary' | 'secondary' | 'danger' {
    if (color === 'warn') {
      return 'danger';
    }

    if (color === 'accent') {
      return 'secondary';
    }

    return 'primary';
  }
}