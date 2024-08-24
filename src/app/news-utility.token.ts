import { HttpClient } from '@angular/common/http';
import {
  InjectionToken,
  EnvironmentProviders,
  makeEnvironmentProviders,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { tap } from 'rxjs';
import { Country } from './models/country-api.model';
import { toSignal } from '@angular/core/rxjs-interop';

export const NewsApiToken = new InjectionToken<string>('NewsApiToken');
export const BaseUrl = new InjectionToken<string>('BaseUrl');
export const AllCountries = new InjectionToken<Signal<Country.Responce[]>>(
  'CountryBaseUrl',
);

export function provideApiToken(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NewsApiToken,
      useValue: 'bd48e84c6f8f4f2f90ecd34d46b3b390',
    },
    {
      provide: BaseUrl,
      useFactory: () => {
        return `https://newsapi.org`;
      },
      deps: [NewsApiToken],
    },
    {
      provide: AllCountries,
      useFactory: () => {
        const http = inject(HttpClient);
        const data = localStorage.getItem('AllCountries');
        if (data) {
          return signal(JSON.parse(data)).asReadonly();
        }
        return toSignal(
          http
            .get('https://restcountries.com/v3.1/all')
            .pipe(
              tap((data) =>
                localStorage.setItem('AllCountries', JSON.stringify(data)),
              ),
            ),
        );
      },
    },
  ]);
}
