import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GalleryService } from '../../../services/gallery.service';
import { ApiService } from '../../../services/api.service';
import { GalleryItem } from '../../../models';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './admin-gallery.component.html',
  styleUrl: './admin-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGalleryComponent implements OnInit {
  items = signal<GalleryItem[]>([]);

  constructor(
    private galleryService: GalleryService,
    public api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    firstValueFrom(this.galleryService.getAll()).then((res) => this.items.set(res.data || []));
  }

  async deleteItem(id: string): Promise<void> {
    if (!confirm('Delete this image?')) return;
    try {
      await firstValueFrom(this.galleryService.delete(id));
      this.snackBar.open('Image deleted', 'Close', { duration: 3000 });
      this.load();
    } catch {
      this.snackBar.open('Failed to delete', 'Close', { duration: 3000 });
    }
  }
}
