import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { SeoService } from '../../services/seo.service';
import { Service } from '../../models';
import { STATIC_SERVICES } from '../../core/constants/static-services';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, SectionTitleComponent, ServiceCardComponent, ScrollRevealDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent implements OnInit {
  services = signal<Service[]>(STATIC_SERVICES);

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Services',
      description: 'Explore our premium nail services — Gel, Acrylic, Bridal, Chrome, 3D Art & more at नखRaah Nail Studio.',
    });
  }
}
