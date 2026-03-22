import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridToolbarComponent {
  @Input() title = '';
  @Input() enableSearch = true;
  @Input() enableExport = true;

  @Output() searchChange = new EventEmitter<string>();
  @Output() exportCsv = new EventEmitter<void>();
  @Output() exportExcel = new EventEmitter<void>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  @Output() autoSize = new EventEmitter<void>();

  onSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
