import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule, SectionTitleComponent, ScrollRevealDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  clientCount = signal(0);
  private targetCount = 2500;

  team = [
    {
      name: 'Shreya',
      role: 'Lead Nail Artist',
      bio: 'With a passion for precision and creativity, Shreya leads every design — from delicate bridal art to bold luxury sets.',
      image: 'assets/images/team/shreya.jpg',
    },
    {
      name: 'Atharva',
      role: 'Marketing & Operations',
      bio: 'Atharva keeps नखRaah running beautifully — managing client experience, brand partnerships, and the magic behind the scenes.',
      image: 'assets/images/team/atharva.jpg',
    },
  ];

  philosophy = [
    { icon: 'spa', title: 'Self-Care Ritual', desc: 'We believe nail care is a form of self-love and personal expression.' },
    { icon: 'eco', title: 'Clean Beauty', desc: 'Premium, non-toxic products that are gentle on you and the environment.' },
    { icon: 'groups', title: 'Community', desc: 'Building a space where every woman feels beautiful, confident, and celebrated.' },
  ];

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'About Us',
      description: 'Meet the cousins behind नखRaah Nail Studio. Our story, mission, vision, and philosophy of premium nail artistry.',
    });
    this.animateCounter();
  }

  private animateCounter(): void {
    const duration = 2000;
    const steps = 60;
    const increment = this.targetCount / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= this.targetCount) {
        this.clientCount.set(this.targetCount);
        clearInterval(interval);
      } else {
        this.clientCount.set(Math.floor(current));
      }
    }, duration / steps);
  }
}
