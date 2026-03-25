/**
 * grid-no-rows-overlay.component.ts
 * ─────────────────────────────────────────────────────────────
 * Shown when the grid has zero rows (empty state).
 * Registered via gridOptions.noRowsOverlayComponent.
 * Accepts an optional custom message via noRowsOverlayComponentParams.
 */
import { Component } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import { INoRowsOverlayParams } from 'ag-grid-community';

export interface NoRowsOverlayParams extends INoRowsOverlayParams {
  message?: string;
}

@Component({
  selector: 'app-grid-no-rows-overlay',
  standalone: true,
  template: `
    <div class="no-rows-overlay">
      <div class="no-rows-overlay__icon">⊘</div>
      <span class="no-rows-overlay__title">No records found</span>
      <span class="no-rows-overlay__sub">{{ message }}</span>
    </div>
  `,
  styles: [`
    .no-rows-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: 100%;
      pointer-events: none;
    }

    .no-rows-overlay__icon {
      font-size: 32px;
      color: #bdbdbd;
      line-height: 1;
    }

    .no-rows-overlay__title {
      font-size: 14px;
      font-weight: 600;
      color: #757575;
    }

    .no-rows-overlay__sub {
      font-size: 12px;
      color: #9e9e9e;
    }
  `],
})
export class GridNoRowsOverlayComponent implements INoRowsOverlayAngularComp {
  message = 'Try adjusting your filters or search term.';

  agInit(params: NoRowsOverlayParams): void {
    this.message = params.message ?? this.message;
  }
}