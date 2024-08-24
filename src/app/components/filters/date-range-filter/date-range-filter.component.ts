/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, effect, forwardRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-date-range-filter',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeFilterComponent),
      multi: true,
    },
    provideNativeDateAdapter(),
  ],
  template: `
    @if (range; as range) {
      <mat-form-field (blur)="onTouched()">
        <mat-label>Enter a date range</mat-label>
        <mat-date-range-input [formGroup]="range" [rangePicker]="picker">
          <input matStartDate formControlName="from" placeholder="Start date" />
          <input matEndDate formControlName="to" placeholder="End date" />
        </mat-date-range-input>
        <mat-hint>MM/DD/YYYY – MM/DD/YYYY</mat-hint>
        <mat-datepicker-toggle
          matIconSuffix
          [for]="picker"
        ></mat-datepicker-toggle>
        <mat-date-range-picker #picker></mat-date-range-picker>

        @if (range.controls.from.hasError('matStartDateInvalid')) {
          <mat-error>Invalid start date</mat-error>
        }
        @if (range.controls.to.hasError('matEndDateInvalid')) {
          <mat-error>Invalid end date</mat-error>
        }
      </mat-form-field>
    }
  `,
  styleUrl: './date-range-filter.component.css',
})
export class DateRangeFilterComponent implements ControlValueAccessor {
  onChange: any = () => {};
  onTouched: any = () => {};
  writeValue(obj: any): void {
    this.range.patchValue(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) this.range.disable();
    else this.range.enable();
  }
  range = new FormGroup({
    from: new FormControl(new Date()),
    to: new FormControl(new Date()),
  });

  rangeSignal = toSignal(this.range.valueChanges);

  constructor() {
    effect(() => {
      if (this.rangeSignal()?.from && this.rangeSignal()?.to) {
        this.onChange(this.rangeSignal());
      }
    });
  }
}
