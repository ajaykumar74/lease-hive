import { Component, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, forwardRef } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, Subscription, auditTime, merge, of, startWith, switchMap, takeUntil } from 'rxjs';
import { ISelectItem } from './ISelectItem';
import { LoggedInUserService } from './LoggedInUserService';
import { CurrencyDefaultService } from './currency-default.service';

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
  @Input() party: Record<string, unknown> | null = null;
  @Input() parentTransaction: Record<string, unknown> | null = null;
  @Input() organisation: Record<string, unknown> | null = null;
  @Input() inputId = 'CurrencyCode';
  @Input() placeholder = 'Select One';

  currencyOptions: ISelectItem[] = [];
  value = '';
  disabled = false;

  private isManuallyOverridden = false;
  private savedCurrencyCode = '';
  private automaticallyAppliedCurrency = '';
  private readonly refreshDefault$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();
  private organisationControlSubscription?: Subscription;
  private formContextSubscription?: Subscription;
  private loggedInUserSubscription?: Subscription;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private loggedInUserService: LoggedInUserService,
    private currencyDefaultService: CurrencyDefaultService,
    @Optional() private controlContainer: ControlContainer
  ) {}

  ngOnInit(): void {
    this.currencyOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
    this.bindOrganisationControl();
    this.bindFormContext();

    this.refreshDefault$.pipe(
      startWith(void 0),
      auditTime(0),
      switchMap(() => this.isManuallyOverridden || this.savedCurrencyCode
        ? of(null)
        : this.currencyDefaultService.resolveDefaultCurrency(this.getDefaultContext())
      ),
      takeUntil(this.destroy$)
    ).subscribe(currencyCode => this.applyDefaultCurrency(currencyCode || ''));

    // The component can be constructed while the login request is still in
    // flight. Re-evaluate an automatic fallback as soon as tenant data arrives
    // so a temporary INR never remains instead of Tenant.DefaultCurrency.
    this.loggedInUserSubscription = this.loggedInUserService.loggedInUserEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currencyOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
        this.requestDefaultRefresh();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organisationControl']) {
      this.bindOrganisationControl();
    }

    if (changes['organisationId'] || changes['party'] || changes['parentTransaction'] || changes['organisation']) {
      this.requestDefaultRefresh();
    }
  }

  writeValue(value: string | null): void {
    this.value = this.normalizeCurrency(value);
    if (!this.value || this.value === this.automaticallyAppliedCurrency || this.isManuallyOverridden) return;

    // A non-empty persisted value is the model value passed into the shared
    // resolver for edit screens and must take precedence over every default.
    if (this.isEditingExistingRecord()) {
      this.savedCurrencyCode = this.value;
      return;
    }

    // A caller may initialise a new form from a copied transaction. Treat it
    // like a user-provided value instead of replacing it with a later lookup.
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

  onCurrencyChange(value: string | null): void {
    if (this.isCurrencyReadOnly) return;

    this.value = this.normalizeCurrency(value);
    this.isManuallyOverridden = Boolean(this.value);
    this.automaticallyAppliedCurrency = '';
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

    this.organisationControlSubscription = this.organisationControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.requestDefaultRefresh());
  }

  private bindFormContext(): void {
    const form = this.getParentForm();
    if (!form) return;

    const contextControls = this.getContextControlNames(form)
      .map(controlName => form.get(controlName))
      .filter((control): control is AbstractControl => control !== null);
    if (!contextControls.length) return;

    this.formContextSubscription?.unsubscribe();
    this.formContextSubscription = merge(...contextControls.map(control => control.valueChanges))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.requestDefaultRefresh());
  }

  private getDefaultContext(): {
    modelCurrencyCode: string;
    party: Record<string, unknown> | null;
    partyId: number | string | null;
    parentTransaction: Record<string, unknown> | null;
    parentTransactionId: number | string | null;
    parentTransactionEndpoint: string | null;
    organisation: Record<string, unknown> | null;
    organisationId: number | string | null;
  } {
    const form = this.getParentForm();
    const partyControlName = form ? this.findFirstControl(form, [
      'CustomerPartyId', 'SupplierPartyId', 'InsurerPartyId', 'BuyerPartyId',
      'LesseePartyId', 'LessorPartyId', 'PartyId', 'BrokerPartyId'
    ]) : null;
    const organisationControlName = form ? this.findFirstControl(form, [
      'OrganisationId', 'BillingOrganisationId', 'LessorOrganisationId',
      'BuyingOrganisationId', 'OriginatingOrganisationId', 'OwningOrganisationId'
    ]) ?? Object.keys(form.controls).find(field => field.endsWith('OrganisationId')) ?? null : null;
    const parentControlName = form ? Object.keys(form.controls)
      .find(field => Boolean(this.currencyDefaultService.getParentTransactionEndpoint(field))) || null : null;
    const referenceIdControlName = form ? this.findFirstControl(form, ['SourceReferenceId', 'ReferenceId']) : null;
    const referenceTypeControlName = form ? this.findFirstControl(form, ['SourceReferenceType', 'ReferenceType']) : null;
    const parentTransactionEndpoint = parentControlName
      ? this.currencyDefaultService.getParentTransactionEndpoint(parentControlName)
      : this.currencyDefaultService.getParentTransactionEndpointForReferenceType(
        referenceTypeControlName ? form?.get(referenceTypeControlName)?.value : null
      );

    return {
      modelCurrencyCode: this.savedCurrencyCode,
      party: this.party,
      partyId: partyControlName ? form?.get(partyControlName)?.value : null,
      parentTransaction: this.parentTransaction,
      parentTransactionId: parentControlName
        ? form?.get(parentControlName)?.value
        : referenceIdControlName ? form?.get(referenceIdControlName)?.value : null,
      parentTransactionEndpoint,
      organisation: this.organisation,
      organisationId: this.organisationControl?.value ?? (organisationControlName
        ? form?.get(organisationControlName)?.value
        : this.organisationId)
    };
  }

  private getContextControlNames(form: FormGroup): string[] {
    return Object.keys(form.controls).filter(field =>
      field.endsWith('PartyId') ||
      field.endsWith('OrganisationId') ||
      field === 'SourceReferenceId' ||
      field === 'SourceReferenceType' ||
      field === 'ReferenceId' ||
      field === 'ReferenceType' ||
      Boolean(this.currencyDefaultService.getParentTransactionEndpoint(field))
    );
  }

  private findFirstControl(form: FormGroup, candidates: string[]): string | null {
    return candidates.find(candidate => Boolean(form.get(candidate))) || null;
  }

  private applyDefaultCurrency(currencyCode: string): void {
    if (this.isManuallyOverridden || this.savedCurrencyCode || !currencyCode) {
      return;
    }

    this.automaticallyAppliedCurrency = this.normalizeCurrency(currencyCode);
    this.value = currencyCode;
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

  private normalizeCurrency(value: string | null | undefined): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  get isCurrencyReadOnly(): boolean {
    const multiCurrencyEnabled = this.loggedInUserService.loggedInUser?.Tenant?.MultiCurrencyEnabled;
    return multiCurrencyEnabled === false || multiCurrencyEnabled === 0 || String(multiCurrencyEnabled).toLowerCase() === 'false';
  }

  ngOnDestroy(): void {
    this.organisationControlSubscription?.unsubscribe();
    this.formContextSubscription?.unsubscribe();
    this.loggedInUserSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
