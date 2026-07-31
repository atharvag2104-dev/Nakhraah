import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

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
        path: 'blog',
        loadComponent: () => import('./pages/blog/blog.component').then((m) => m.BlogPageComponent),
        title: 'Blog | नखRaah Nail Studio',
      },
      {
        path: 'blog/:slug',
        loadComponent: () => import('./pages/blog-post/blog-post.component').then((m) => m.BlogPostPageComponent),
        title: 'Blog | नखRaah Nail Studio',
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
        title: 'Contact | नखRaah Nail Studio',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
