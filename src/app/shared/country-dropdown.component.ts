import { Component, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, forwardRef } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, Subscription, auditTime, merge, of, startWith, switchMap, takeUntil } from 'rxjs';
import { ISelectItem } from './ISelectItem';
import { LoggedInUserService } from './LoggedInUserService';
import { CurrencyDefaultService } from './currency-default.service';

@Component({
  selector: 'app-country-dropdown',
  standalone: false,
  templateUrl: './country-dropdown.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CountryDropdownComponent),
    multi: true
  }]
})
export class CountryDropdownComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() organisationId: number | string | null = null;
  @Input() organisationControl: AbstractControl | null = null;
  @Input() organisation: Record<string, unknown> | null = null;
  @Input() inputId = 'CountryCode';
  @Input() optionSet = 'CountryCode';
  @Input() placeholder = 'Select One';

  countryOptions: ISelectItem[] = [];
  value = '';
  disabled = false;

  private isManuallyOverridden = false;
  private savedCountryCode = '';
  private automaticallyAppliedCountry = '';
  private readonly refreshDefault$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();
  private organisationControlSubscription?: Subscription;
  private formContextSubscription?: Subscription;
  private loggedInUserSubscription?: Subscription;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private readonly loggedInUserService: LoggedInUserService,
    private readonly defaultService: CurrencyDefaultService,
    @Optional() private readonly controlContainer: ControlContainer
  ) {}

  ngOnInit(): void {
    this.countryOptions = this.loggedInUserService.getPicklistOptions(this.optionSet);
    this.bindOrganisationControl();
    this.bindFormContext();

    this.refreshDefault$.pipe(
      startWith(void 0),
      auditTime(0),
      switchMap(() => this.isManuallyOverridden || this.savedCountryCode
        ? of(null)
        : this.defaultService.resolveDefaultCountry(this.getDefaultContext())
      ),
      takeUntil(this.destroy$)
    ).subscribe(countryCode => this.applyDefaultCountry(countryCode || ''));

    this.loggedInUserSubscription = this.loggedInUserService.loggedInUserEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.countryOptions = this.loggedInUserService.getPicklistOptions(this.optionSet);
        this.requestDefaultRefresh();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organisationControl']) {
      this.bindOrganisationControl();
    }

    if (changes['organisationId'] || changes['organisation'] || changes['optionSet']) {
      this.countryOptions = this.loggedInUserService.getPicklistOptions(this.optionSet);
      this.requestDefaultRefresh();
    }
  }

  writeValue(value: string | null): void {
    this.value = this.normalizeCountry(value);
    if (!this.value || this.value === this.automaticallyAppliedCountry || this.isManuallyOverridden) return;

    if (this.isEditingExistingRecord()) {
      this.savedCountryCode = this.value;
      return;
    }

    this.isManuallyOverridden = true;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onCountryChange(value: string | null): void {
    if (this.isCountryReadOnly) return;

    this.value = this.normalizeCountry(value);
    this.isManuallyOverridden = Boolean(this.value);
    this.automaticallyAppliedCountry = '';
    this.onChange(this.value);
    this.onTouched();
  }

  markAsTouched(): void {
    this.onTouched();
  }

  get isCountryReadOnly(): boolean {
    const multiCountryEnabled = this.loggedInUserService.loggedInUser?.Tenant?.MultiCountryEnabled;
    return multiCountryEnabled === false || multiCountryEnabled === 0 || String(multiCountryEnabled).toLowerCase() === 'false';
  }

  private bindOrganisationControl(): void {
    this.organisationControlSubscription?.unsubscribe();
    if (!this.organisationControl) return;

    this.organisationControlSubscription = this.organisationControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.requestDefaultRefresh());
  }

  private bindFormContext(): void {
    const form = this.getParentForm();
    if (!form) return;

    const organisationControls = Object.keys(form.controls)
      .filter(field => field.endsWith('OrganisationId'))
      .map(field => form.get(field))
      .filter((control): control is AbstractControl => control !== null);
    if (!organisationControls.length) return;

    this.formContextSubscription?.unsubscribe();
    this.formContextSubscription = merge(...organisationControls.map(control => control.valueChanges))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.requestDefaultRefresh());
  }

  private getDefaultContext(): {
    modelCountryCode: string;
    organisation: Record<string, unknown> | null;
    organisationId: number | string | null;
  } {
    const form = this.getParentForm();
    const organisationControlName = form
      ? Object.keys(form.controls).find(field => field.endsWith('OrganisationId')) ?? null
      : null;

    return {
      modelCountryCode: this.savedCountryCode,
      organisation: this.organisation,
      organisationId: this.organisationControl?.value ?? (organisationControlName
        ? form?.get(organisationControlName)?.value
        : this.organisationId)
    };
  }

  private applyDefaultCountry(countryCode: string): void {
    if (this.isManuallyOverridden || this.savedCountryCode || !countryCode) return;

    this.automaticallyAppliedCountry = this.normalizeCountry(countryCode);
    this.value = this.automaticallyAppliedCountry;
    this.onChange(this.value);
  }

  private requestDefaultRefresh(): void {
    this.refreshDefault$.next();
  }

  private getParentForm(): FormGroup | null {
    const control = this.controlContainer?.control;
    return control instanceof FormGroup ? control : null;
  }

  private isEditingExistingRecord(): boolean {
    return Number(this.getParentForm()?.get('Id')?.value) > 0;
  }

  private normalizeCountry(value: string | null | undefined): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  ngOnDestroy(): void {
    this.organisationControlSubscription?.unsubscribe();
    this.formContextSubscription?.unsubscribe();
    this.loggedInUserSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
