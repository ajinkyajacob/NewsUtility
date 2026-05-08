import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NewsApiToken } from '../news-utility.token';

export const newsApiTokenInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {
  const token = inject(NewsApiToken);
  const clonedReq = req.clone({ headers: req.headers.set('X-Api-Key', token), params: req.params.set('key', token)});
  return next(clonedReq);
};
