import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { SeoService } from '../../services/seo.service';
import { STATIC_BLOG_POSTS } from '../../core/constants/static-blog-posts';
import { BlogPost } from '../../models';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [MatIconModule, SectionTitleComponent, BlogCardComponent, ScrollRevealDirective],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPageComponent implements OnInit {
  posts: BlogPost[] = STATIC_BLOG_POSTS.slice(0, 6);
  page = signal(0);

  pages = computed(() => {
    const items = this.posts;
    const chunks: BlogPost[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      chunks.push(items.slice(i, i + 3));
    }
    return chunks;
  });

  maxPage = computed(() => Math.max(0, this.pages().length - 1));

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Blog',
      description:
        'Nail care journals from नखRaah — gel aftercare, cuticle rituals, bridal timelines, and recovering natural nails.',
    });
  }

  prev(): void {
    this.page.update((p) => Math.max(0, p - 1));
  }

  next(): void {
    this.page.update((p) => Math.min(this.maxPage(), p + 1));
  }

  goTo(index: number): void {
    this.page.set(index);
  }
}
