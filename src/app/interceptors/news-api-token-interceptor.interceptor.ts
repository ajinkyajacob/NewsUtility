import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NewsApiToken } from '../news-utility.token';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const newsApiTokenInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {

  return next(req).pipe(
    catchError((error) => {

      console.error('API Error:', error);

      return of({
        status: 'fail',
        totalResults: 0,
        articles: [],
      });

    })
  );
};