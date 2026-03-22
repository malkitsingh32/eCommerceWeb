import { Component, signal } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layouts',
  imports: [SidebarComponent, HeaderComponent,RouterModule],
  templateUrl: './layouts.html',
  styleUrl: './layouts.scss',
})
export class Layouts {
  readonly isSidebarCollapsed = signal(false);

  onToggleSidebar(): void {
    this.isSidebarCollapsed.update((value) => !value);
  }
}
