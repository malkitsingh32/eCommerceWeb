import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../components/button/button';
import { ToolbarActionButtonConfig } from '../../config/grid-config.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-grid-toolbar',
  standalone: true,
  imports: [CommonModule, Button, MatFormFieldModule, MatInputModule],
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridToolbarComponent {
  @Input() title = '';
  @Input() enableSearch = true;
  @Input() enableExport = true;
  @Input() actionButton?: ToolbarActionButtonConfig;

  @Output() searchChange = new EventEmitter<string>();
  @Output() exportCsv = new EventEmitter<void>();
  @Output() exportExcel = new EventEmitter<void>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  @Output() autoSize = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<void>();

  onSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
