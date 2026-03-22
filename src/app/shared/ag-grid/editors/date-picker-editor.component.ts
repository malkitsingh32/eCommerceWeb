import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

@Component({
  selector: 'app-date-picker-editor',
  standalone: true,
  template: `
    <input
      #dateInput
      type="date"
      class="date-editor"
      [value]="value"
      (change)="onChange($event)"
    />
  `,
  styles: [`
    .date-editor {
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
export class DatePickerEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;
  value = '';

  agInit(params: ICellEditorParams): void {
    this.value = params.value ?? '';
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.dateInput?.nativeElement.focus());
  }

  onChange(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
  }

  getValue(): string { return this.value; }
  isPopup(): boolean { return false; }
}
