import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-title" [class.center]="center">
      @if (subtitle) {
        <span class="subtitle">{{ subtitle }}</span>
      }
      <h2 class="title">
        @if (title) {
          {{ title }}
        } @else {
          <ng-content select="[sectionTitle]"></ng-content>
        }
      </h2>
      <div class="title-line" [class.center]="center"></div>
      @if (description) {
        <p class="description">{{ description }}</p>
      }
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .section-title {
      margin-bottom: 1.85rem;
      &.center { text-align: center; }
    }
    .subtitle {
      display: inline-block;
      font-family: $font-primary;
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: $champagne-deep;
      margin-bottom: 0.5rem;
    }
    .title {
      font-family: $font-display;
      font-size: clamp(1.85rem, 3.6vw, 2.65rem);
      font-weight: 500;
      color: $text;
      margin: 0 0 0.55rem;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }
    .title-line {
      width: 40px;
      height: 1px;
      background: linear-gradient(90deg, $champagne, transparent);
      margin-bottom: 0.7rem;
      &.center { margin-left: auto; margin-right: auto; background: linear-gradient(90deg, transparent, $champagne, transparent); width: 64px; }
    }
    .description {
      font-size: 0.98rem;
      font-weight: 300;
      color: $text-light;
      max-width: 520px;
      line-height: 1.65;
      margin: 0;
      .center & { margin: 0 auto; }
    }

    :host ::ng-deep .brand-hindi,
    :host ::ng-deep .brand-nakh {
      font-family: $font-marathi, $font-display;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: $ink;
    }

    :host ::ng-deep .brand-latin,
    :host ::ng-deep .brand-raah {
      font-family: $font-display;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: $champagne-deep;
    }

    :host-context(.dark-mode) .title { color: #f2efe8; }
    :host-context(.dark-mode) .description { color: #a39e94; }
    :host-context(.dark-mode) .subtitle { color: #E8D5B5; }
    :host-context(.dark-mode) ::ng-deep .brand-hindi,
    :host-context(.dark-mode) ::ng-deep .brand-nakh { color: #f2efe8; }
    :host-context(.dark-mode) ::ng-deep .brand-latin,
    :host-context(.dark-mode) ::ng-deep .brand-raah { color: #E8D5B5; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() description = '';
  @Input() center = true;
}
