import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { AppointmentService } from '../../services/appointment.service';
import { ServiceService } from '../../services/service.service';
import { SeoService } from '../../services/seo.service';
import { Service } from '../../models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatSnackBarModule, SectionTitleComponent, ScrollRevealDirective,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  form!: FormGroup;
  services = signal<Service[]>([]);
  submitting = signal(false);
  submitted = signal(false);
  env = environment;
  today = new Date();
  mapUrl!: SafeResourceUrl;
  private sanitizer = inject(DomSanitizer);

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private serviceService: ServiceService,
    private seo: SeoService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.googleMapsEmbed);

    this.seo.update({
      title: 'Contact',
      description: 'Book your appointment at नखRaah Nail Studio. Contact us via phone, WhatsApp, or our online form.',
    });

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      service_id: [''],
      preferred_date: ['', Validators.required],
      preferred_time: ['', Validators.required],
      message: [''],
    });

    firstValueFrom(this.serviceService.getAll()).then((res) => {
      this.services.set(res.data || []);
      const serviceSlug = this.route.snapshot.queryParamMap.get('service');
      if (serviceSlug) {
        const match = res.data?.find((s) => s.slug === serviceSlug);
        if (match) this.form.patchValue({ service_id: match.id });
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const val = this.form.value;
    const service = this.services().find((s) => s.id === val.service_id);

    try {
      await firstValueFrom(this.appointmentService.create({
        name: val.name,
        phone: val.phone,
        email: val.email,
        service_id: val.service_id || undefined,
        service_name: service?.name,
        preferred_date: this.formatDate(val.preferred_date),
        preferred_time: val.preferred_time,
        message: val.message,
      }));
      this.submitted.set(true);
      this.form.reset();
      this.snackBar.open('Appointment request sent! We will contact you soon.', 'Close', { duration: 5000 });
    } catch {
      this.snackBar.open('Something went wrong. Please try again or WhatsApp us.', 'Close', { duration: 5000 });
    } finally {
      this.submitting.set(false);
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.touched || !control.errors) return '';
    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Please enter a valid email';
    if (control.errors['pattern']) return 'Please enter a valid phone number';
    if (control.errors['minlength']) return 'Name is too short';
    return 'Invalid value';
  }
}
