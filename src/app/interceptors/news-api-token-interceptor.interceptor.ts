import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NewsApiToken } from '../news-utility.token';
import { catchError} from 'rxjs/operators';

export const newsApiTokenInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {
  const token = inject(NewsApiToken);
  const clonedReq = req.clone({
    //  headers: req.headers.set('X-Api-Key', token),
     params: req.params.set('apiKey', token)
    });
  return next(clonedReq).pipe(
    catchError((e) => {
      return {
        "status": "fail",
        "totalResults": 0,
        "articles": []
      }
    })
  );
};
