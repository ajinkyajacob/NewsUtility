import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CountriesFilterComponent } from './countries-filter/countries-filter.component';
import { DateRangeFilterComponent } from './date-range-filter/date-range-filter.component';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CountriesFilterComponent,
    ReactiveFormsModule,
    DateRangeFilterComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    @if (form(); as form) {
      <form class="filter-container" [formGroup]="form">
        <mat-form-field class="example-full-width">
          <mat-label>Search</mat-label>
          <input
            matInput
            formControlName="q"
            placeholder="Search Term"
            value="Sushi"
          />
        </mat-form-field>
        <app-countries-filter formControlName="country"></app-countries-filter>
        <app-date-range-filter formControlName="range"></app-date-range-filter>
      </form>
    }
  `,
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange = output<any>();

  destroyRef = inject(DestroyRef);

  form = input.required<
    FormGroup<{
      q: FormControl<string | null>;
      country: FormControl<string | null>;
      range: FormControl<{ to: Date; from: Date } | null>;
    }>
  >();

  formSignal = computed(() => {
    return this.form() ? this.form() : null;
  });

  constructor() {
    effect(() => {
      const form = this.formSignal();
      if (form)
        form.valueChanges
          .pipe(debounceTime(800), takeUntilDestroyed(this.destroyRef))
          .subscribe((x) => {
            this.onFilterChange.emit({
              q: x.q,
              country: x.country,
              to: x.range?.to?.toISOString(),
              from: x.range?.from?.toISOString(),
            });
          });
    });
  }
}
