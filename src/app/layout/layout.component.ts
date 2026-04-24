import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  template: `
    <div class="layout">
      <app-sidebar />
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .layout {
        display: block;
      }
      .content {
        margin-left: 220px;
        padding: 32px 40px;
        min-height: 100vh;
        background: #f5f5f5;
      }
    `,
  ],
})
export class LayoutComponent {}
