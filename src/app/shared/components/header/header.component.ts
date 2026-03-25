import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MatToolbarModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly isSidebarCollapsed = input(false);
  readonly toggleSidebar = output<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
