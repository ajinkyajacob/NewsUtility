import { Component, computed, inject } from '@angular/core';
import { NewsContainerComponent } from '../news-container/news-container.component';
import { NewsCardComponent } from '../card/card.component';
import { FiltersComponent } from '../filters/filters.component';
import { NewsApiService } from '../../services/news-api.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { BehaviorSubject, shareReplay, switchMap } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewsApi } from '../../models/news-api.model';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NewsContainerComponent,
    NewsCardComponent,
    FiltersComponent,
    AsyncPipe,
    MatPaginatorModule,
    JsonPipe,
    MatButtonToggleModule,
  ],
  template: `
    <!-- {{ filterForm().value | json }} -->
    <div class="layout">
      <app-filters
        [form]="filterForm()"
        (onFilterChange)="onFilterChange($event)"
      ></app-filters>

      <app-news-container>
        @for (article of articles(); track article.title) {
          <app-news-card [article]="article"></app-news-card>
        } @empty {
          @if (status()) {
            No records available...
          } @else {
            <div>...Loading</div>
          }
        }
      </app-news-container>

      <mat-paginator
        [pageIndex]="refreshApiSignal()?.page"
        [pageSize]="refreshApiSignal()?.pageSize"
        [length]="totalResults()"
        (page)="onPage($event)"
      ></mat-paginator>
    </div>
  `,
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  filterForm = computed(() => {
    return new FormGroup({
      q: new FormControl(''),
      country: new FormControl('in'),
      range: new FormControl<{ to: Date; from: Date }>({
        to: new Date(),
        from: new Date(),
      }),
    });
  });

  newsApiService = inject(NewsApiService);
  refreshApi$ = new BehaviorSubject<NewsApi.HeadLines.Options>({
    page: 1,
    pageSize: 12,
    q: this.filterForm().value.q ?? '',
    country: this.filterForm().value.country ?? 'in',
  });

  refreshApiSignal = toSignal(this.refreshApi$);

  getHeadlinesResponce$ = this.refreshApi$.pipe(
    switchMap((ops) => {
      return this.newsApiService.getHeadlines(ops).pipe(shareReplay(2));
    }),
  );

  getHeadlinesResponceSignal = toSignal(this.getHeadlinesResponce$, {
    rejectErrors: true,
    manualCleanup: true,
  });

  articles = computed(() => this.getHeadlinesResponceSignal()?.articles);
  status = computed(() => !!this.getHeadlinesResponceSignal()?.status);

  totalResults = computed(
    () => this.getHeadlinesResponceSignal()?.totalResults,
  );

  onPage(e: PageEvent) {
    console.count('t');
    this.refreshApi$.next({ ...this.refreshApi$.value, page: e.pageIndex });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange(e: any) {
    this.refreshApi(e);
  }
  refreshApi(ops: Partial<NewsApi.HeadLines.Options>) {
    this.refreshApi$.next({ ...this.refreshApi$.value, ...ops });
  }
}
