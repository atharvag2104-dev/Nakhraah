import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { AmbientVideoComponent } from '../../components/ambient-video/ambient-video.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule, SectionTitleComponent, AmbientVideoComponent, ScrollRevealDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  clientCount = signal(0);
  private targetCount = 2500;

  founder = {
    name: 'Shreya Anturkar',
    image: 'assets/images/team/shreya.jpg',
    paragraphs: [
      'Shreya Anturkar is the heart of नखRaah — a nail artist who treats every set like wearable couture. With a passion for precision and soft colour stories, she built the atelier for clients who want calm beauty over noise.',
      'Her journey began with late-night practice at home and a simple belief: nails should feel as refined on day ten as they do when you leave the chair. That belief became a quiet luxury studio in Pune.',
      'Today, Shreya specialises in bridal couture, everyday gel, chrome light, and bespoke artistry — always paced with care, hygiene-first rituals, and finishes that photograph beautifully.',
      'At नखRaah, every appointment is a private fitting: unhurried conversation, meticulous shaping, and a finish composed just for your hands.',
    ],
  };

  journey = [
    {
      year: '2023',
      title: 'First strokes',
      text: 'The craft begins at home — shape, colour, and the quiet discipline of a clean finish that would later define नखRaah.',
    },
    {
      year: '2024',
      title: 'Clients & craft',
      text: 'Early clients arrive by word of mouth. Soft nudes, bridal details, and appointments that never feel rushed become the signature.',
    },
    {
      year: '2025',
      title: 'The atelier idea',
      text: 'नखRaah takes form as a vision: not a busy salon, but a calm maison for editorial nail artistry in Pune.',
    },
    {
      year: '2026',
      title: 'The doors open',
      text: 'The atelier welcomes clients into soft sage light, champagne accents, and a ritual designed for lasting beauty.',
    },
  ];

  philosophy = [
    {
      icon: 'spa',
      title: 'Self-Care Ritual',
      desc: 'We believe nail care is a form of self-love and personal expression — a pause in the week that restores calm as much as it refines beauty.',
    },
    {
      icon: 'eco',
      title: 'Clean Beauty',
      desc: 'Premium, carefully chosen products and sterilised tools — gentle on you, exacting in finish, and never a compromise on hygiene.',
    },
    {
      icon: 'groups',
      title: 'Community',
      desc: 'Building a space where every client feels beautiful, confident, and celebrated — welcomed like a familiar face, never like a number.',
    },
  ];

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'About Us',
      description:
        'Meet Shreya Anturkar, the artist behind नखRaah Nail Studio. Our story, journey, mission, and philosophy of premium nail artistry.',
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
