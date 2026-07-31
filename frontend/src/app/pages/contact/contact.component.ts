import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { SeoService } from '../../services/seo.service';
import { LuxuryMotionService } from '../../services/luxury-motion.service';
import { Service } from '../../models';
import { environment } from '../../../environments/environment';
import { STATIC_SERVICES } from '../../core/constants/static-services';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SectionTitleComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  services = signal<Service[]>(STATIC_SERVICES);
  submitting = signal(false);
  formNotice = signal('');
  attemptedSubmit = signal(false);
  timePickerOpen = signal(false);
  servicePickerOpen = signal(false);
  selectedHour = signal('10');
  selectedMinute = signal('00');
  selectedPeriod = signal<'AM' | 'PM'>('AM');
  env = environment;
  mapUrl!: SafeResourceUrl;
  today = new Date();

  hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  minutes = ['00', '15', '30', '45'];
  periods: Array<'AM' | 'PM'> = ['AM', 'PM'];

  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly motion = inject(LuxuryMotionService);
  private noticeTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private fb: FormBuilder,
    private seo: SeoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.googleMapsEmbed);

    this.seo.update({
      title: 'Contact',
      description: 'Book your appointment at नखRaah Nail Studio via WhatsApp.',
    });

    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\u0900-\u097F\s]+$/),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      service_id: [''],
      preferred_date: [null as Date | null, Validators.required],
      preferred_time: ['', Validators.required],
      message: [''],
    });

    const serviceSlug = this.route.snapshot.queryParamMap.get('service');
    if (serviceSlug) {
      const match = STATIC_SERVICES.find((s) => s.slug === serviceSlug);
      if (match) this.form.patchValue({ service_id: match.id });
    }
  }

  ngOnDestroy(): void {
    this.motion.startScroll();
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeAllPickers();
  }

  selectedServiceLabel(): string {
    const id = String(this.form?.get('service_id')?.value || '');
    if (!id) return '';
    return this.services().find((s) => String(s.id) === id)?.name || '';
  }

  isServiceSelected(id: string): boolean {
    return String(this.form.get('service_id')?.value || '') === String(id);
  }

  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\u0900-\u097F\s]/g, '');
    if (cleaned !== input.value) {
      input.value = cleaned;
      this.form.get('name')?.setValue(cleaned, { emitEvent: false });
    }
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^0-9]/g, '').slice(0, 10);
    if (cleaned !== input.value) {
      input.value = cleaned;
      this.form.get('phone')?.setValue(cleaned, { emitEvent: false });
    }
  }

  toggleServicePicker(event: Event): void {
    event.stopPropagation();
    const next = !this.servicePickerOpen();
    this.closeTimePicker(false);
    this.servicePickerOpen.set(next);
    if (next) this.motion.stopScroll();
    else this.syncScrollLock();
  }

  pickService(id: string): void {
    this.form.patchValue({ service_id: id });
    this.closeServicePicker();
  }

  closeServicePicker(resumeScroll = true): void {
    if (!this.servicePickerOpen()) return;
    this.servicePickerOpen.set(false);
    if (resumeScroll) this.syncScrollLock();
  }

  onServicePanelWheel(event: WheelEvent): void {
    event.stopPropagation();
    const panel = event.currentTarget as HTMLElement;
    const atTop = panel.scrollTop <= 0 && event.deltaY < 0;
    const atBottom =
      panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1 && event.deltaY > 0;
    if (atTop || atBottom) event.preventDefault();
  }

  toggleTimePicker(event: Event): void {
    event.stopPropagation();
    const next = !this.timePickerOpen();
    this.closeServicePicker(false);
    this.timePickerOpen.set(next);
    if (next) {
      this.syncPickerFromForm();
      this.motion.stopScroll();
    } else {
      this.syncScrollLock();
    }
  }

  closeTimePicker(resumeScroll = true): void {
    if (!this.timePickerOpen()) return;
    this.timePickerOpen.set(false);
    if (resumeScroll) this.syncScrollLock();
  }

  closeAllPickers(): void {
    this.closeTimePicker(false);
    this.closeServicePicker(false);
    this.syncScrollLock();
  }

  private syncScrollLock(): void {
    if (this.timePickerOpen() || this.servicePickerOpen()) this.motion.stopScroll();
    else this.motion.startScroll();
  }

  onTimePanelWheel(event: WheelEvent): void {
    event.stopPropagation();
    const col = (event.target as HTMLElement | null)?.closest('.time-col') as HTMLElement | null;
    if (!col || col.classList.contains('meridian')) {
      event.preventDefault();
      return;
    }

    const atTop = col.scrollTop <= 0 && event.deltaY < 0;
    const atBottom =
      col.scrollTop + col.clientHeight >= col.scrollHeight - 1 && event.deltaY > 0;

    if (atTop || atBottom) {
      event.preventDefault();
    }
  }

  pickHour(hour: string): void {
    this.selectedHour.set(hour);
    this.commitTime();
  }

  pickMinute(minute: string): void {
    this.selectedMinute.set(minute);
    this.commitTime();
  }

  pickPeriod(period: 'AM' | 'PM'): void {
    this.selectedPeriod.set(period);
    this.commitTime();
  }

  clearTime(): void {
    this.form.patchValue({ preferred_time: '' });
    this.selectedHour.set('10');
    this.selectedMinute.set('00');
    this.selectedPeriod.set('AM');
    this.closeTimePicker();
  }

  bookOnWhatsApp(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    const name = String(this.form.get('name')?.value || '').trim();
    const phone = String(this.form.get('phone')?.value || '').replace(/\D/g, '');
    const preferredDate = this.form.get('preferred_date')?.value;
    const preferredTime = String(this.form.get('preferred_time')?.value || '').trim();

    // Keep digits-only phone in the form for WhatsApp payload
    if (phone !== String(this.form.get('phone')?.value || '')) {
      this.form.patchValue({ phone }, { emitEvent: false });
    }

    const issues: string[] = [];
    if (!name) issues.push('enter your name');
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\u0900-\u097F\s]+$/.test(name) || /\d/.test(name)) {
      issues.push('enter a valid name without numbers or special characters');
    } else if (name.length < 2) {
      issues.push('enter a name with at least 2 letters');
    }

    if (!phone) issues.push('enter your phone number');
    else if (!/^[0-9]{10}$/.test(phone)) {
      issues.push('enter a valid 10-digit phone number (numbers only)');
    }

    if (!preferredDate) issues.push('select a preferred date');
    if (!preferredTime) issues.push('select a preferred time');

    if (issues.length) {
      this.attemptedSubmit.set(true);
      this.showNotice(this.buildIssueMessage(issues));
      this.cdr.detectChanges();
      return;
    }

    this.dismissNotice();
    this.attemptedSubmit.set(false);
    this.submitting.set(true);
    this.cdr.detectChanges();

    const val = this.form.getRawValue();
    const service = this.services().find((s) => String(s.id) === String(val.service_id));

    const lines = [
      'नखRaah — Appointment Request',
      '----------------------------',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service: ${service?.name || 'To be discussed'}`,
      `Date: ${this.formatDate(preferredDate)}`,
      `Time: ${preferredTime}`,
    ];

    const message = String(val.message || '').trim();
    if (message) lines.push(`Note: ${message}`);
    lines.push('----------------------------', 'Please confirm my slot. Thank you!');

    const url = `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.location.href = url;
  }

  showInvalid(field: string): boolean {
    if (!this.attemptedSubmit()) return false;
    const control = this.form.get(field);
    if (!control) return false;
    if (field === 'preferred_date') return !control.value;
    if (field === 'preferred_time') return !String(control.value || '').trim();
    if (field === 'phone') {
      const digits = String(control.value || '').replace(/\D/g, '');
      return !/^[0-9]{10}$/.test(digits);
    }
    if (field === 'name') {
      const value = String(control.value || '').trim();
      return !value || value.length < 2 || /\d/.test(value) || !!control.hasError('pattern');
    }
    return control.invalid;
  }

  dismissNotice(): void {
    this.formNotice.set('');
    if (this.noticeTimer) {
      clearTimeout(this.noticeTimer);
      this.noticeTimer = undefined;
    }
  }

  private buildIssueMessage(issues: string[]): string {
    if (issues.length === 1) return `Please ${issues[0]}.`;
    if (issues.length === 2) return `Please ${issues[0]} and ${issues[1]}.`;
    const last = issues[issues.length - 1];
    return `Please ${issues.slice(0, -1).join(', ')}, and ${last}.`;
  }

  private showNotice(message: string): void {
    this.formNotice.set(message);
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => this.dismissNotice(), 4500);
  }

  private commitTime(): void {
    const value = `${this.selectedHour()}:${this.selectedMinute()} ${this.selectedPeriod()}`;
    this.form.patchValue({ preferred_time: value });
  }

  private syncPickerFromForm(): void {
    const raw = String(this.form.get('preferred_time')?.value || '').trim();
    const match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return;
    this.selectedHour.set(match[1].padStart(2, '0'));
    this.selectedMinute.set(match[2]);
    this.selectedPeriod.set(match[3].toUpperCase() as 'AM' | 'PM');
  }

  private formatDate(date: Date | string | null): string {
    if (!date) return '';
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return String(date);
  }
}
