import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { BackToTopComponent } from '../../../components/back-to-top/back-to-top.component';
import { WhatsappFloatComponent } from '../../../components/whatsapp-float/whatsapp-float.component';
import { DecorativeBgComponent } from '../../../components/decorative-bg/decorative-bg.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, BackToTopComponent, WhatsappFloatComponent, DecorativeBgComponent],
  template: `
    <app-decorative-bg />
    <app-navbar />
    <main class="main-content">
      <router-outlet />
    </main>
    <app-footer />
    <app-back-to-top />
    <app-whatsapp-float />
  `,
  styles: [`
    .main-content {
      padding-top: 80px;
      min-height: 100vh;
    }
  `],
})
export class MainLayoutComponent {}
