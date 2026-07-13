import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <a
      class="whatsapp-float"
      [href]="'https://wa.me/' + env.whatsappNumber + '?text=' + message"
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
    >
      <mat-icon>chat</mat-icon>
    </a>
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .whatsapp-float {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #25D366;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
      z-index: 999;
      text-decoration: none;
      animation: pulse 2s infinite;
      transition: transform 0.3s ease;

      mat-icon { font-size: 28px; width: 28px; height: 28px; }
      &:hover { transform: scale(1.1); animation: none; }
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); }
      50% { box-shadow: 0 4px 30px rgba(37, 211, 102, 0.7); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappFloatComponent {
  env = environment;
  message = encodeURIComponent('Hi! I would like to book an appointment at नखRaah Nail Studio.');
}
