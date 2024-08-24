import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NewsApi } from '../../models/news-api.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [MatCardModule, DatePipe, RouterLink],
  template: `
    <mat-card
      class="example-card"
      appearance="outlined"
      (click)="openLinkInNewTab(article().url)"
    >
      <mat-card-header>
        <!-- <div mat-card-avatar class="example-header-image"></div> -->
        <mat-card-title>{{ article().title }}</mat-card-title>
        <mat-card-subtitle>{{ article().author }}</mat-card-subtitle>
      </mat-card-header>
      @if (article().urlToImage) {
        <img
          mat-card-image
          [src]="article().urlToImage"
          alt="Thumbnail of a Article"
        />
      }
      <mat-card-content>
        <p>
          {{ article().content }}
        </p>
      </mat-card-content>
      <mat-card-footer>
        <mat-card-content>
          <div>published: {{ article().publishedAt | date }}</div>
        </mat-card-content>
      </mat-card-footer>
      <!-- <mat-card-actions>
    <button mat-button>LIKE</button>
    <button mat-button>SHARE</button>
    <a mat-button  [href]="article().url">Source</a>
  </mat-card-actions> -->
    </mat-card>
  `,
  styleUrl: './card.component.css',
})
export class NewsCardComponent {
  article = input.required<NewsApi.HeadLines.Article>();

  openLinkInNewTab(url: string) {
    window.open(url, '_blank');
  }
}
