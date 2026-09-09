import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, EMPTY, Subject, Subscription, catchError, defaultIfEmpty, distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs';
import { ISelectItem } from './ISelectItem';
import { LoggedInUserService } from './LoggedInUserService';
import { OrganisationService } from '@/views/organisations/organisation/organisation.service';
import { OrganisationUnitService } from '@/views/organisations/organisationUnit/organisationUnit.service';
import { ApplicationUserService } from '@/views/applicationUser/applicationUser.service';

@Component({
  selector: 'app-currency-dropdown',
  standalone: false,
  templateUrl: './currency-dropdown.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CurrencyDropdownComponent),
    multi: true
  }]
})
export class CurrencyDropdownComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() organisationId: number | string | null = null;
  @Input() organisationControl: AbstractControl | null = null;
  @Input() inputId = 'CurrencyCode';
  @Input() placeholder = 'Select One';

  currencyOptions: ISelectItem[] = [];
  value = '';
  disabled = false;

  private organisationDefaultCurrency = '';
  private isManuallyOverridden = false;
  private readonly organisationId$ = new BehaviorSubject<number>(0);
  private readonly destroy$ = new Subject<void>();
  private organisationControlSubscription?: Subscription;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private loggedInUserService: LoggedInUserService,
    private organisationService: OrganisationService,
    private organisationUnitService: OrganisationUnitService,
    private applicationUserService: ApplicationUserService
  ) {}

  ngOnInit(): void {
    this.currencyOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');

    this.organisationId$.pipe(
      filter(organisationId => organisationId > 0),
      distinctUntilChanged(),
      switchMap(organisationId => this.organisationService.getById(organisationId)),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.applyDefaultCurrency(response.data?.FunctionalCurrency || '', true);
    });

    this.bindOrganisationControl();
    this.loadLoggedInUserDefaultCurrency();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organisationControl']) {
      this.bindOrganisationControl();
    }

    if (changes['organisationId'] && !this.organisationControl) {
      this.organisationId$.next(Number(this.organisationId) || 0);
    }
  }

  writeValue(value: string | null): void {
    this.value = value || '';
    this.isManuallyOverridden = Boolean(this.value) && this.value !== this.organisationDefaultCurrency;
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

  onCurrencyChange(value: string | null): void {
    this.value = value || '';
    this.isManuallyOverridden = this.value !== this.organisationDefaultCurrency;
    this.onChange(this.value);
    this.onTouched();
  }

  markAsTouched(): void {
    this.onTouched();
  }

  private bindOrganisationControl(): void {
    this.organisationControlSubscription?.unsubscribe();

    if (!this.organisationControl) {
      return;
    }

    this.organisationId$.next(Number(this.organisationControl.value) || 0);
    this.organisationControlSubscription = this.organisationControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(organisationId => this.organisationId$.next(Number(organisationId) || 0));
  }

  private loadLoggedInUserDefaultCurrency(): void {
    if (this.hasSelectedOrganisation()) {
      return;
    }

    this.applicationUserService.getCurrent().pipe(
      map(response => response.data),
      filter(applicationUser => Number(applicationUser?.DefaultOrganisationUnitId) > 0),
      switchMap(applicationUser => this.organisationUnitService.getById(applicationUser.DefaultOrganisationUnitId)),
      map(response => response.data),
      filter(organisationUnit => Number(organisationUnit?.OrganisationId) > 0),
      switchMap(organisationUnit => this.organisationService.getById(organisationUnit.OrganisationId)),
      defaultIfEmpty(null),
      catchError(() => {
        this.applyDefaultCurrency(this.loggedInUserService.loggedInUser?.Tenant?.DefaultCurrency || '');
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.applyDefaultCurrency(response?.data?.FunctionalCurrency || this.loggedInUserService.loggedInUser?.Tenant?.DefaultCurrency || '');
    });
  }

  private applyDefaultCurrency(currencyCode: string, allowSelectedOrganisation = false): void {
    if ((!allowSelectedOrganisation && this.hasSelectedOrganisation()) || this.isManuallyOverridden || !currencyCode) {
      return;
    }

    this.organisationDefaultCurrency = currencyCode;
    this.value = currencyCode;
    this.onChange(this.value);
  }

  private hasSelectedOrganisation(): boolean {
    return Number(this.organisationControl?.value ?? this.organisationId) > 0;
  }

  ngOnDestroy(): void {
    this.organisationControlSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
