import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[style.display]': "fullWidth ? 'block' : 'inline-block'",
  },
})
export class Button {
  @Input() label: string = 'Button';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() disabled: boolean = false;
  @Input() icon?: string;
  @Input() iconSrc?: string;
  @Input() iconAlt = '';
  @Input() title?: string;
  @Input() ariaLabel?: string;
  @Input() ariaExpanded?: boolean | null = null;
  @Input() buttonClass = '';
  @Input() fullWidth = true;
  @Input() materialStyle: 'flat' | 'raised' | 'stroked' | 'icon' = 'flat';

  @Output() clicked = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }

  get materialColor(): 'primary' | 'accent' | 'warn' | undefined {
    if (this.variant === 'danger') {
      return 'warn';
    }

    if (this.variant === 'primary') {
      return 'primary';
    }

    return undefined;
  }
}
