/**
 * grid-loading-overlay.component.ts
 * ─────────────────────────────────────────────────────────────
 * Custom loading overlay shown while the grid is fetching data.
 * Replaces AG Grid's default spinner.
 * Registered in GridConfigService via gridOptions.loadingOverlayComponent.
 */
import { Component } from '@angular/core';
import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { ILoadingOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-loading-overlay',
  standalone: true,
  template: `
    <div class="grid-overlay">
      <div class="spinner">
        <div class="spinner__ring"></div>
      </div>
      <span class="grid-overlay__label">Loading...</span>
    </div>
  `,
  styles: [`
    .grid-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      height: 100%;
      background: rgba(255, 255, 255, 0.75);
      pointer-events: none;
    }

    .spinner {
      width: 36px;
      height: 36px;
    }

    .spinner__ring {
      width: 36px;
      height: 36px;
      border: 3px solid #e0e0e0;
      border-top-color: #1976d2;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .grid-overlay__label {
      font-size: 13px;
      color: #666;
      font-weight: 500;
      letter-spacing: 0.3px;
    }
  `],
})
export class GridLoadingOverlayComponent implements ILoadingOverlayAngularComp {
  agInit(_params: ILoadingOverlayParams): void {}
}