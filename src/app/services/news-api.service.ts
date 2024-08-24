import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseUrl } from '../news-utility.token';
import { NewsApi } from '../models/news-api.model';

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  http = inject(HttpClient);
  baseUrl = inject(BaseUrl);

  getHeadlines(ops: NewsApi.HeadLines.Options) {
    return this.http.get<NewsApi.HeadLines.Responce>(
      `${this.baseUrl}/v2/top-headlines`,
      { params: ops as never },
    );
  }

  getEverything(ops: NewsApi.Everything.Options) {
    return this.http.get<NewsApi.Everything.Responce>(
      `${this.baseUrl}/v2/everything`,
      { params: ops as never },
    );
  }
}
