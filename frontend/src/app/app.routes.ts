import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
        title: 'Home | नखRaah Nail Studio',
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
        title: 'About Us | नखRaah Nail Studio',
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/services/services.component').then((m) => m.ServicesPageComponent),
        title: 'Services | नखRaah Nail Studio',
      },
      {
        path: 'gallery',
        loadComponent: () => import('./pages/gallery/gallery.component').then((m) => m.GalleryPageComponent),
        title: 'Gallery | नखRaah Nail Studio',
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
        title: 'Contact | नखRaah Nail Studio',
      },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/admin-login.component').then((m) => m.AdminLoginComponent),
    canActivate: [guestGuard],
    title: 'Admin Login | नखRaah',
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
        title: 'Dashboard | Admin',
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/admin/services/admin-services.component').then((m) => m.AdminServicesComponent),
        title: 'Services | Admin',
      },
      {
        path: 'gallery',
        loadComponent: () => import('./pages/admin/gallery/admin-gallery.component').then((m) => m.AdminGalleryComponent),
        title: 'Gallery | Admin',
      },
      {
        path: 'appointments',
        loadComponent: () => import('./pages/admin/appointments/admin-appointments.component').then((m) => m.AdminAppointmentsComponent),
        title: 'Appointments | Admin',
      },
      {
        path: 'testimonials',
        loadComponent: () => import('./pages/admin/testimonials/admin-testimonials.component').then((m) => m.AdminTestimonialsComponent),
        title: 'Testimonials | Admin',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
