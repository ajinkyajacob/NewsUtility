/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe } from '@angular/common';
import { Component, computed, forwardRef, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AllCountries } from '../../../news-utility.token';
import { Country } from '../../../models/country-api.model';
import { debounceTime, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-countries-filter',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountriesFilterComponent),
      multi: true,
    },
  ],
  template: `
    <mat-form-field class="example-full-width">
      <mat-label>Countries</mat-label>
      <input
        type="text"
        matInput
        [formControl]="myControl"
        [matAutocomplete]="auto"
        (blur)="onTouched()"
      />
      <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayWith">
        @for (item of filteredCountriesSignal(); track $index) {
          <mat-option [value]="item">{{ item.name.common }}</mat-option>
        } @empty {
          <mat-option [value]="">No records</mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
    <!-- {{ myControl.value }} -->
  `,
  styleUrl: './countries-filter.component.css',
})
export class CountriesFilterComponent implements ControlValueAccessor {
  onChange: any = () => {};
  onTouched: any = () => {};
  writeValue(value: string): void {
    console.log({ value });
    const foundValue = this.filteredCountriesSignal().find(
      (x) => x.cca2.toLowerCase() === value,
    );
    if (!foundValue) return;
    this.myControl.setValue(foundValue);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.myControl.disable();
    } else {
      this.myControl.enable();
    }
  }

  myControl = new FormControl<string | Country.Responce>('');
  myControlSignal = toSignal(
    this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(800),
      tap(
        (val) =>
          typeof val === 'object' && this.onChange(val?.cca2.toLowerCase()),
      ),
    ),
  );
  allCountriesSignal = inject(AllCountries);

  filteredCountriesSignal = computed(() => {
    const allCountries = this.allCountriesSignal();
    if (!allCountries.length) return [];
    const value = this.myControlSignal();
    console.log('value', value);
    let filterValue = '';
    if (value && typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else if (typeof value === 'object') {
      filterValue = value?.name.common.toLowerCase() ?? '';
    } else {
      filterValue = '';
    }
    return this.allCountriesSignal().filter((option) =>
      JSON.stringify(option).toLowerCase().includes(filterValue),
    );
  });

  displayWith(item: Country.Responce) {
    return item?.name?.common ?? '';
  }
}
