import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-header" [class.sortable]="params.enableSorting">
      <span class="header-label" (click)="onSortRequested($event)">
        {{ params.displayName }}
      </span>
      @if (params.enableSorting) {
        <span class="sort-icon" (click)="onSortRequested($event)">
          @if (sortState === 'asc') {
            <span>▲</span>
          }
          @if (sortState === 'desc') {
            <span>▼</span>
          }
          @if (!sortState) {
            <span class="sort-inactive">⇅</span>
          }
        </span>
      }
      @if (params.enableMenu) {
        <span
          class="menu-icon"
          (click)="onMenuClicked($event)"
        >☰</span>
      }
    </div>
  `,
  styles: [`
    .custom-header {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      font-weight: 600;
      font-size: 12px;
      color: #333;
      user-select: none;
    }
    .header-label { flex: 1; }
    .sortable .header-label { cursor: pointer; }
    .sort-icon { cursor: pointer; font-size: 10px; color: #1976d2; }
    .sort-inactive { color: #bbb; }
    .menu-icon {
      cursor: pointer;
      font-size: 13px;
      color: #888;
      padding: 0 2px;
      &:hover { color: #1976d2; }
    }
  `],
})
export class CustomHeaderComponent implements IHeaderAngularComp {
  params!: IHeaderParams;
  sortState: 'asc' | 'desc' | null = null;

  agInit(params: IHeaderParams): void {
    this.params = params;
    params.column.addEventListener('sortChanged', () => this.updateSortState());
    this.updateSortState();
  }

  refresh(params: IHeaderParams): boolean {
    this.params = params;
    return true;
  }

  onSortRequested(event: MouseEvent): void {
    if (!this.params.enableSorting) return;
    const nextSort =
      this.sortState === null ? 'asc' :
      this.sortState === 'asc' ? 'desc' : null;
    this.params.setSort(nextSort as any, event.shiftKey);
  }

  onMenuClicked(event: MouseEvent): void {
    this.params.showColumnMenu(event.target as HTMLElement);
  }

  private updateSortState(): void {
    const sort = this.params.column.getSort();
    this.sortState = sort === 'asc' ? 'asc' : sort === 'desc' ? 'desc' : null;
  }
}
