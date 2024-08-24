import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NewsApiToken } from '../news-utility.token';

export const newsApiTokenInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {
  const token = inject(NewsApiToken);
  const clonedReq = req.clone({ headers: req.headers.set('X-Api-Key', token) });
  clonedReq.params.set('key', token);
  return next(clonedReq);
};
