import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const newsApiTokenInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('API Error:', error);

      return of(
        new HttpResponse({
          status: 200,
          body: {
            status: 'fail',
            totalResults: 0,
            articles: [],
          },
        }),
      );
    }),
  );
};
