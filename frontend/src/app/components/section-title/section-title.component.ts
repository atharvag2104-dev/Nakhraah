import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-title" [class.center]="center">
      @if (subtitle) {
        <span class="subtitle">
          <span class="dot"></span>{{ subtitle }}<span class="dot"></span>
        </span>
      }
      <h2 class="title">{{ title }}</h2>
      <div class="title-line" [class.center]="center"></div>
      @if (description) {
        <p class="description">{{ description }}</p>
      }
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .section-title {
      margin-bottom: 3rem;
      &.center { text-align: center; }
    }
    .subtitle {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: $accent;
      margin-bottom: 0.75rem;

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: $accent;
        opacity: 0.5;
      }
    }
    .title {
      font-family: $font-display;
      font-size: clamp(2rem, 4vw, 2.75rem);
      font-weight: 600;
      color: $text;
      margin: 0 0 0.75rem;
      line-height: 1.2;
    }
    .title-line {
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, $accent, $secondary);
      border-radius: 2px;
      margin-bottom: 1rem;
      &.center { margin-left: auto; margin-right: auto; }
    }
    .description {
      font-size: 1.05rem;
      color: $text-light;
      max-width: 600px;
      line-height: 1.7;
      margin: 0;
      .center & { margin: 0 auto; }
    }

    :host-context(.dark-mode) .title { color: #eef1f6; }
    :host-context(.dark-mode) .description { color: #949eb2; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() description = '';
  @Input() center = true;
}
