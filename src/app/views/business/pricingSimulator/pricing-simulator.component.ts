import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { MessageComponent } from '@/shared/message.component';
import { SpinnerComponent } from '@/shared/spinner.component';
import {
  IPricingSimulatorInput,
  PricingSimulationChargeInput,
  PricingSimulationResult,
  PricingSimulationServiceInput
} from './pricing-simulator';
import { PricingSimulatorService } from './pricing-simulator.service';

@Component({
  selector: 'app-pricing-simulator',
  standalone: false,
  templateUrl: './pricing-simulator.component.html',
  styleUrl: './pricing-simulator.component.scss'
})
export class PricingSimulatorComponent implements OnInit {
  @ViewChild('messagePanel') messageService?: MessageComponent;
  @ViewChild(SpinnerComponent) spinner?: SpinnerComponent;

  readonly pricingMethodOptions: ISelectItem[] = [
    { Id: 1, Value: 'CALCULATED', Text: 'Calculated rental' },
    { Id: 2, Value: 'MANUAL', Text: 'Manual rental' }
  ];

  assetCategoryOptions: ISelectItem[] = [];
  leaseServiceOptions: ISelectItem[] = [];
  leaseTypeOptions: ISelectItem[] = [];
  billingFrequencyOptions: ISelectItem[] = [];
  paymentTimingOptions: ISelectItem[] = [];
  chargeFrequencyOptions: ISelectItem[] = [];
  result: PricingSimulationResult | null = null;
  calculating = false;
  form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly simulatorService: PricingSimulatorService,
    private readonly loggedInUserService: LoggedInUserService
  ) {
    this.form = this.createForm();
  }

  get services(): FormArray<FormGroup> {
    return this.form.get('Services') as FormArray<FormGroup>;
  }

  get charges(): FormArray<FormGroup> {
    return this.form.get('Charges') as FormArray<FormGroup>;
  }

  get currencyCode(): string {
    return this.form.get('CurrencyCode')?.value || 'GBP';
  }

  get isManual(): boolean {
    return String(this.form.get('PricingModeCode')?.value || '').toUpperCase() === 'MANUAL';
  }

  ngOnInit(): void {
    this.loadLookups();
  }

  calculate(): void {
    if (this.calculating) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService?.showError('Complete the required pricing assumptions before calculating.');
      return;
    }

    this.calculating = true;
    this.spinner?.showLoadingMsg('Calculating lease pricing...');
    this.simulatorService.calculate(this.createRequest()).pipe(
      finalize(() => {
        this.calculating = false;
        this.spinner?.hide();
      })
    ).subscribe({
      next: response => {
        this.result = (response?.data || response) as PricingSimulationResult;
        this.messageService?.showSuccess('Pricing calculation refreshed.');
      },
      error: error => this.messageService?.showError(error)
    });
  }

  reset(): void {
    this.result = null;
    this.services.clear();
    this.charges.clear();
    this.form.reset(this.defaultFormValue());
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  addService(): void {
    this.services.push(this.formBuilder.group({
      LeaseServiceId: [0],
      ServiceName: [''],
      IsIncluded: [false],
      IsSeparatelyChargeable: [true],
      ChargeFrequencyCode: [this.form.value.BillingFrequency || 'MONTHLY'],
      UnitAmount: [0, Validators.min(0)],
      Quantity: [1, [Validators.min(0)]]
    }));
  }

  removeService(index: number): void {
    this.services.removeAt(index);
  }

  onServiceSelected(service: FormGroup): void {
    const selectedId = Number(service.get('LeaseServiceId')?.value) || 0;
    const selected = this.leaseServiceOptions.find(option => option.Id === selectedId);
    service.patchValue({ ServiceName: selected?.Text || '' });
  }

  addCharge(): void {
    this.charges.push(this.formBuilder.group({
      Description: ['', [Validators.required, Validators.maxLength(200)]],
      IsRecurring: [false],
      ChargeFrequencyCode: [this.form.value.BillingFrequency || 'MONTHLY'],
      StartPeriodNo: [null],
      EndPeriodNo: [null],
      Amount: [0, Validators.min(0)]
    }));
  }

  removeCharge(index: number): void {
    this.charges.removeAt(index);
  }

  totalFinanceCharges(): number {
    return (this.result?.Schedule || []).reduce((total, line) => total + (Number(line.FinanceCharge) || 0), 0);
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      AssetCategoryId: [0, [Validators.required, Validators.min(1)]],
      LeaseTypeCode: [''],
      EffectiveDate: [new Date()],
      CurrencyCode: [''],
      PricingModeCode: ['CALCULATED', Validators.required],
      PaymentTimingCode: ['ARREARS', Validators.required],
      BillingFrequency: ['MONTHLY', Validators.required],
      Quantity: [1, [Validators.required, Validators.min(1)]],
      UnitAssetCost: [0, [Validators.required, Validators.min(0)]],
      TermMonths: [36, [Validators.required, Validators.min(1), Validators.max(600)]],
      AnnualFundingRate: [0, [Validators.min(0)]],
      EstimatedResidualValuePercent: [0, [Validators.min(0)]],
      EstimatedResidualValueAmount: [0, [Validators.min(0)]],
      NonRefundableDownPaymentAmount: [0, [Validators.min(0)]],
      ContractualBulletPaymentAmount: [0, [Validators.min(0)]],
      RefundableSecurityDepositAmount: [0, [Validators.min(0)]],
      UsageAllowance: [0, [Validators.min(0)]],
      ExpectedUsage: [0, [Validators.min(0)]],
      ExcessUsageRate: [0, [Validators.min(0)]],
      ManualPeriodicRentalAmount: [0, [Validators.min(0)]],
      Services: this.formBuilder.array<FormGroup>([]),
      Charges: this.formBuilder.array<FormGroup>([])
    });
  }

  private defaultFormValue(): Record<string, unknown> {
    return {
      AssetCategoryId: 0,
      LeaseTypeCode: '',
      EffectiveDate: new Date(),
      CurrencyCode: '',
      PricingModeCode: 'CALCULATED',
      PaymentTimingCode: 'ARREARS',
      BillingFrequency: 'MONTHLY',
      Quantity: 1,
      UnitAssetCost: 0,
      TermMonths: 36,
      AnnualFundingRate: 0,
      EstimatedResidualValuePercent: 0,
      EstimatedResidualValueAmount: 0,
      NonRefundableDownPaymentAmount: 0,
      ContractualBulletPaymentAmount: 0,
      RefundableSecurityDepositAmount: 0,
      UsageAllowance: 0,
      ExpectedUsage: 0,
      ExcessUsageRate: 0,
      ManualPeriodicRentalAmount: 0
    };
  }

  private createRequest(): IPricingSimulatorInput {
    const value = this.form.getRawValue();
    const services: PricingSimulationServiceInput[] = (value.Services || []).map((service: any) => ({
      QuoteServiceId: 0,
      ServiceName: service.ServiceName || '',
      IsIncluded: Boolean(service.IsIncluded),
      IsSeparatelyChargeable: Boolean(service.IsSeparatelyChargeable),
      ChargeFrequencyCode: service.ChargeFrequencyCode || '',
      UnitAmount: this.numberValue(service.UnitAmount),
      Quantity: this.numberValue(service.Quantity)
    }));
    const charges: PricingSimulationChargeInput[] = (value.Charges || []).map((charge: any) => ({
      QuoteChargeId: 0,
      Description: charge.Description || '',
      IsRecurring: Boolean(charge.IsRecurring),
      ChargeFrequencyCode: charge.ChargeFrequencyCode || '',
      StartPeriodNo: charge.StartPeriodNo || null,
      EndPeriodNo: charge.EndPeriodNo || null,
      Amount: this.numberValue(charge.Amount)
    }));

    return {
      AssetCategoryId: this.numberValue(value.AssetCategoryId),
      LeaseTypeCode: value.LeaseTypeCode || '',
      EffectiveDate: this.toIsoDate(value.EffectiveDate),
      CurrencyCode: value.CurrencyCode || '',
      PricingModeCode: value.PricingModeCode || 'CALCULATED',
      PaymentTimingCode: value.PaymentTimingCode || 'ARREARS',
      BillingFrequency: value.BillingFrequency || 'MONTHLY',
      Quantity: this.numberValue(value.Quantity),
      UnitAssetCost: this.numberValue(value.UnitAssetCost),
      TermMonths: this.numberValue(value.TermMonths),
      AnnualFundingRate: this.numberValue(value.AnnualFundingRate),
      EstimatedResidualValuePercent: this.numberValue(value.EstimatedResidualValuePercent),
      EstimatedResidualValueAmount: this.numberValue(value.EstimatedResidualValueAmount),
      NonRefundableDownPaymentAmount: this.numberValue(value.NonRefundableDownPaymentAmount),
      ContractualBulletPaymentAmount: this.numberValue(value.ContractualBulletPaymentAmount),
      RefundableSecurityDepositAmount: this.numberValue(value.RefundableSecurityDepositAmount),
      UsageAllowance: this.numberValue(value.UsageAllowance),
      ExpectedUsage: this.numberValue(value.ExpectedUsage),
      ExcessUsageRate: this.numberValue(value.ExcessUsageRate),
      ManualPeriodicRentalAmount: this.numberValue(value.ManualPeriodicRentalAmount),
      Services: services,
      Charges: charges
    };
  }

  private loadLookups(): void {
    this.loggedInUserService.getEntityLookupOptions('asset-categories')
      .subscribe(options => this.assetCategoryOptions = options);
    this.loggedInUserService.getEntityLookupOptions('lease-services')
      .subscribe(options => this.leaseServiceOptions = options);
    this.leaseTypeOptions = this.withFallback(this.loggedInUserService.getPicklistOptions('LeaseTypeCode'), ['Operating', 'Finance']);
    this.billingFrequencyOptions = this.withFallback(this.loggedInUserService.getPicklistOptions('BillingFrequency'), ['Monthly', 'Quarterly', 'Annually']);
    this.paymentTimingOptions = this.withFallback(this.loggedInUserService.getPicklistOptions('PaymentTimingCode'), ['Arrears', 'Advance']);
    this.chargeFrequencyOptions = this.withFallback(this.loggedInUserService.getPicklistOptions('ChargeFrequencyCode'), ['Monthly', 'Quarterly', 'Annually', 'Once']);
  }

  private withFallback(options: ISelectItem[], fallback: string[]): ISelectItem[] {
    return options?.length
      ? options
      : fallback.map((value, index) => ({ Id: index + 1, Value: value.toUpperCase().replaceAll(' ', ''), Text: value }));
  }

  private numberValue(value: unknown): number {
    return Number(value) || 0;
  }

  private toIsoDate(value: unknown): string | undefined {
    if (!value) return undefined;
    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  }
}
