import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

export interface DropdownEditorParams {
  options: { label: string; value: any }[];
}

@Component({
  selector: 'app-dropdown-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select #selectEl class="dropdown-editor" [(ngModel)]="selectedValue">
      @for (opt of options; track $index) {
        <option [value]="opt.value">{{ opt.label }}</option>
      }
    </select>
  `,
  styles: [`
    .dropdown-editor {
      width: 100%;
      height: 100%;
      padding: 0 4px;
      border: 1px solid #1976d2;
      outline: none;
      font-size: 13px;
      background: #fff;
    }
  `],
})
export class DropdownEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  @ViewChild('selectEl') selectEl!: ElementRef<HTMLSelectElement>;

  selectedValue: any;
  options: { label: string; value: any }[] = [];

  agInit(params: ICellEditorParams & DropdownEditorParams): void {
    this.selectedValue = params.value;
    this.options = params.options ?? [];
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.selectEl?.nativeElement.focus());
  }

  getValue(): any {
    return this.selectedValue;
  }

  isPopup(): boolean {
    return false;
  }
}
