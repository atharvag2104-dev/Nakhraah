import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'nakhraah_theme';
  isDarkMode = signal(this.getInitialTheme());

  constructor() {
    effect(() => {
      const dark = this.isDarkMode();
      document.body.classList.toggle('dark-mode', dark);
      localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.isDarkMode.update((v) => !v);
  }

  private getInitialTheme(): boolean {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
