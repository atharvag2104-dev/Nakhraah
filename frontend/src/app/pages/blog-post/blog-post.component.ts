import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { SeoService } from '../../services/seo.service';
import { getBlogPostBySlug, STATIC_BLOG_POSTS } from '../../core/constants/static-blog-posts';
import { BlogPost } from '../../models';
import { PLACEHOLDER_NAIL } from '../../core/constants/static-images';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [DatePipe, RouterLink, MatIconModule, MagneticDirective, ScrollRevealDirective],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostPageComponent implements OnInit {
  post = signal<BlogPost | null>(null);
  related = signal<BlogPost[]>([]);
  placeholder = PLACEHOLDER_NAIL;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') || '';
      const found = getBlogPostBySlug(slug);

      if (!found) {
        this.router.navigate(['/blog']);
        return;
      }

      this.post.set(found);
      this.related.set(
        STATIC_BLOG_POSTS.filter((p) => p.slug !== found.slug).slice(0, 3)
      );
      this.seo.update({
        title: found.title,
        description: found.excerpt,
      });
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholder;
  }
}
