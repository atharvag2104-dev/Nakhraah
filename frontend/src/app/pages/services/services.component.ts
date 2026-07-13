import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { ServiceService } from '../../services/service.service';
import { SeoService } from '../../services/seo.service';
import { Service } from '../../models';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [SectionTitleComponent, ServiceCardComponent, LoadingSpinnerComponent, ScrollRevealDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent implements OnInit {
  services = signal<Service[]>([]);
  loading = signal(true);

  constructor(
    private serviceService: ServiceService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Services',
      description: 'Explore our premium nail services — Gel, Acrylic, Bridal, Chrome, 3D Art & more at नखRaah Nail Studio.',
    });

    firstValueFrom(this.serviceService.getAll())
      .then((res) => {
        this.services.set(res.data || []);
        this.loading.set(false);
      })
      .catch(() => {
        this.loading.set(false);
      });
  }
}
