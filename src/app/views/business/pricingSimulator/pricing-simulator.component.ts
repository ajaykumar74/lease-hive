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
  PricingSimulationRentalStep,
  PricingSimulationResult,
  PricingSimulationServiceInput,
  PricingSimulationTaxComponent,
  PricingSimulatorDefaults,
  PricingSimulatorLimits,
  PricingSimulatorMethodOptions
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

  pricingMethodOptions: ISelectItem[] = [
    { Id: 1, Value: 'CALCULATED', Text: 'Calculated rental' },
    { Id: 2, Value: 'MANUAL', Text: 'Manual rental' },
    { Id: 3, Value: 'RATE_FACTOR', Text: 'Rate factor' },
    { Id: 4, Value: 'FLAT_RATE', Text: 'Flat rate' },
    { Id: 5, Value: 'STEPPED_RENTAL', Text: 'Stepped rental' },
    { Id: 6, Value: 'USAGE_BASED', Text: 'Usage-based rental' },
    { Id: 7, Value: 'HYBRID', Text: 'Hybrid rental' },
    { Id: 8, Value: 'TARGET_IRR', Text: 'Target IRR / yield' }
  ];
  readonly usageUnitOptions: ISelectItem[] = [
    { Id: 1, Value: 'KM', Text: 'KM' },
    { Id: 2, Value: 'HOURS', Text: 'Hours' },
    { Id: 3, Value: 'COPIES', Text: 'Copies' },
    { Id: 4, Value: 'UNITS', Text: 'Units' }
  ];

  assetCategoryOptions: ISelectItem[] = [];
  leaseServiceOptions: ISelectItem[] = [];
  leaseTypeOptions: ISelectItem[] = [];
  billingFrequencyOptions: ISelectItem[] = [];
  paymentTimingOptions: ISelectItem[] = [];
  chargeFrequencyOptions: ISelectItem[] = [];
  taxCodeOptions: ISelectItem[] = [];
  result: PricingSimulationResult | null = null;
  calculating = false;
  methodOptionsLoading = false;
  form: FormGroup;
  private configuredDefaultPricingMethod = 'CALCULATED';
  private methodOptionsRequestId = 0;
  tenantDefaults: PricingSimulatorDefaults = this.defaultTenantDefaults();
  tenantLimits: PricingSimulatorLimits = this.defaultTenantLimits();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly simulatorService: PricingSimulatorService,
    private readonly loggedInUserService: LoggedInUserService
  ) {
    this.form = this.createForm();
    this.form.get('PricingModeCode')?.valueChanges.subscribe(() => this.updatePricingMethodValidators());
    this.form.get('AssetCategoryId')?.valueChanges.subscribe(assetCategoryId => this.loadPermittedMethods(Number(assetCategoryId) || 0));
    this.updatePricingMethodValidators();
  }

  get services(): FormArray<FormGroup> {
    return this.form.get('Services') as FormArray<FormGroup>;
  }

  get charges(): FormArray<FormGroup> {
    return this.form.get('Charges') as FormArray<FormGroup>;
  }

  get taxComponents(): FormArray<FormGroup> {
    return this.form.get('TaxComponents') as FormArray<FormGroup>;
  }

  get rentalSteps(): FormArray<FormGroup> {
    return this.form.get('RentalSteps') as FormArray<FormGroup>;
  }

  get currencyCode(): string {
    return this.form.get('CurrencyCode')?.value || 'GBP';
  }

  get isManual(): boolean {
    return String(this.form.get('PricingModeCode')?.value || '').toUpperCase() === 'MANUAL';
  }

  get isCalculated(): boolean {
    return String(this.form.get('PricingModeCode')?.value || '').toUpperCase() === 'CALCULATED';
  }

  get isRateFactor(): boolean {
    return String(this.form.get('PricingModeCode')?.value || '').toUpperCase() === 'RATE_FACTOR';
  }

  get isFlatRate(): boolean {
    return String(this.form.get('PricingModeCode')?.value || '').toUpperCase() === 'FLAT_RATE';
  }

  get isSteppedRental(): boolean {
    return String(this.form.get('PricingModeCode')?.value || '').toUpperCase() === 'STEPPED_RENTAL';
  }

  get isUsageBased(): boolean {
    return String(this.form.get('PricingModeCode')?.value || '').toUpperCase() === 'USAGE_BASED';
  }

  get isHybrid(): boolean {
    return String(this.form.get('PricingModeCode')?.value || '').toUpperCase() === 'HYBRID';
  }

  get isUsagePricing(): boolean {
    return this.isUsageBased || this.isHybrid;
  }

  get isTargetIrr(): boolean {
    return String(this.form.get('PricingModeCode')?.value || '').toUpperCase() === 'TARGET_IRR';
  }

  ngOnInit(): void {
    this.loadLookups();
    this.loadPermittedMethods(this.numberValue(this.form.get('AssetCategoryId')?.value));
  }

  calculate(): void {
    if (this.calculating || this.methodOptionsLoading) return;
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
    this.taxComponents.clear();
    this.rentalSteps.clear();
    this.form.reset(this.defaultFormValue());
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.updateTenantLimitValidators();
  }

  addService(): void {
    this.services.push(this.formBuilder.group({
      LeaseServiceId: [0],
      ServiceName: [''],
      IsIncluded: [false],
      IsSeparatelyChargeable: [true],
      ChargeFrequencyCode: [this.form.value.BillingFrequency || 'MONTHLY'],
      UnitAmount: [0, Validators.min(0)],
      Quantity: [1, [Validators.min(0)]],
      LessorCostAmount: [0, Validators.min(0)]
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
      Amount: [0, Validators.min(0)],
      LessorCostAmount: [0, Validators.min(0)]
    }));
  }

  removeCharge(index: number): void {
    this.charges.removeAt(index);
  }

  addRentalStep(): void {
    const previous = this.rentalSteps.at(this.rentalSteps.length - 1)?.getRawValue();
    const fromPeriod = previous ? Number(previous.ToPeriod || 0) + 1 : 1;
    this.rentalSteps.push(this.formBuilder.group({
      FromPeriod: [fromPeriod, [Validators.required, Validators.min(1)]],
      ToPeriod: [this.numberValue(this.form.value.TermMonths) || fromPeriod, [Validators.required, Validators.min(1)]],
      RentalAmount: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeRentalStep(index: number): void {
    this.rentalSteps.removeAt(index);
  }

  addTaxComponent(): void {
    this.taxComponents.push(this.formBuilder.group({
      TaxCode: ['', [Validators.required, Validators.maxLength(50)]],
      TaxRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      AppliesToRental: [true],
      AppliesToServices: [true],
      AppliesToCharges: [true]
    }));
  }

  removeTaxComponent(index: number): void {
    this.taxComponents.removeAt(index);
  }

  onTaxExemptChanged(isTaxExempt: boolean): void {
    this.taxComponents.controls.forEach(tax => {
      if (isTaxExempt) {
        tax.disable({ emitEvent: false });
      } else {
        tax.enable({ emitEvent: false });
      }
    });
  }

  totalFinanceCharges(): number {
    return (this.result?.Schedule || []).reduce((total, line) => total + (Number(line.FinanceCharge) || 0), 0);
  }

  periodicTaxInclusivePayment(): number {
    const firstInstallment = this.result?.Schedule?.find(line => line.PeriodNo === 1);
    return Number(firstInstallment?.TaxInclusiveCustomerPaymentAmount) || 0;
  }

  pricingMethodLabel(value: string): string {
    return this.pricingMethodOptions.find(option => option.Value === value)?.Text || value;
  }

  periodicRentalLabel(): string {
    const method = String(this.result?.PricingModeCode || this.form.get('PricingModeCode')?.value || '').toUpperCase();
    if (method === 'TARGET_IRR') return 'Required periodic rental';
    return method === 'USAGE_BASED' || method === 'HYBRID' ? 'Projected periodic rental' : 'Periodic base rental';
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
      AnnualFundingRate: [0, [Validators.min(0), Validators.max(1000)]],
      RateFactorPerPeriod: [0, [Validators.min(0), Validators.max(100)]],
      AnnualFlatRate: [0, [Validators.min(0), Validators.max(1000)]],
      EstimatedResidualValuePercent: [0, [Validators.min(0), Validators.max(100)]],
      EstimatedResidualValueAmount: [0, [Validators.min(0)]],
      NonRefundableDownPaymentAmount: [0, [Validators.min(0)]],
      ContractualBulletPaymentAmount: [0, [Validators.min(0)]],
      RefundableSecurityDepositAmount: [0, [Validators.min(0)]],
      UsageAllowance: [0, [Validators.min(0)]],
      ExpectedUsage: [0, [Validators.min(0)]],
      ExcessUsageRate: [0, [Validators.min(0)]],
      UsageUnit: [''],
      ExpectedUsagePerPeriod: [0, [Validators.min(0)]],
      IncludedUsagePerPeriod: [0, [Validators.min(0)]],
      UsageRatePerUnit: [0, [Validators.min(0)]],
      FixedBaseRentalAmount: [0, [Validators.min(0)]],
      TargetAnnualIrr: [0, [Validators.min(0), Validators.max(1000)]],
      ManualPeriodicRentalAmount: [0, [Validators.min(0)]],
      RentalSteps: this.formBuilder.array<FormGroup>([]),
      IsTaxExempt: [false],
      TaxComponents: this.formBuilder.array<FormGroup>([]),
      Services: this.formBuilder.array<FormGroup>([]),
      Charges: this.formBuilder.array<FormGroup>([])
    });
  }

  private updatePricingMethodValidators(): void {
    const rateFactor = this.form.get('RateFactorPerPeriod');
    rateFactor?.setValidators(this.isRateFactor
      ? [Validators.required, Validators.min(0.00000001), Validators.max(100)]
      : [Validators.min(0), Validators.max(100)]);
    rateFactor?.updateValueAndValidity({ emitEvent: false });
    const usageUnit = this.form.get('UsageUnit');
    usageUnit?.setValidators(this.isUsagePricing ? [Validators.required] : []);
    usageUnit?.updateValueAndValidity({ emitEvent: false });
    const usageRate = this.form.get('UsageRatePerUnit');
    usageRate?.setValidators(this.isUsagePricing
      ? [Validators.required, Validators.min(0.00000001)]
      : [Validators.min(0)]);
    usageRate?.updateValueAndValidity({ emitEvent: false });
    const targetIrr = this.form.get('TargetAnnualIrr');
    targetIrr?.setValidators(this.isTargetIrr
      ? [Validators.required, Validators.min(this.tenantLimits.MinimumTargetAnnualIrr), Validators.max(this.tenantLimits.MaximumTargetAnnualIrr)]
      : [Validators.min(this.tenantLimits.MinimumTargetAnnualIrr), Validators.max(this.tenantLimits.MaximumTargetAnnualIrr)]);
    targetIrr?.updateValueAndValidity({ emitEvent: false });
    if (this.isSteppedRental && this.rentalSteps.length === 0) this.addRentalStep();
  }

  private defaultFormValue(): Record<string, unknown> {
    return {
      AssetCategoryId: 0,
      LeaseTypeCode: '',
      EffectiveDate: new Date(),
      CurrencyCode: '',
      PricingModeCode: this.configuredDefaultPricingMethod,
      PaymentTimingCode: this.tenantDefaults.PaymentTimingCode,
      BillingFrequency: this.tenantDefaults.BillingFrequency,
      Quantity: 1,
      UnitAssetCost: 0,
      TermMonths: this.tenantDefaults.TermMonths,
      AnnualFundingRate: this.tenantDefaults.AnnualFundingRate,
      RateFactorPerPeriod: 0,
      AnnualFlatRate: 0,
      EstimatedResidualValuePercent: this.tenantDefaults.EstimatedResidualValuePercent,
      EstimatedResidualValueAmount: 0,
      NonRefundableDownPaymentAmount: 0,
      ContractualBulletPaymentAmount: 0,
      RefundableSecurityDepositAmount: 0,
      UsageAllowance: 0,
      ExpectedUsage: 0,
      ExcessUsageRate: 0,
      UsageUnit: '',
      ExpectedUsagePerPeriod: 0,
      IncludedUsagePerPeriod: 0,
      UsageRatePerUnit: 0,
      FixedBaseRentalAmount: 0,
      TargetAnnualIrr: this.tenantDefaults.TargetAnnualIrr,
      ManualPeriodicRentalAmount: 0,
      IsTaxExempt: false
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
      Quantity: this.numberValue(service.Quantity),
      LessorCostAmount: this.numberValue(service.LessorCostAmount)
    }));
    const charges: PricingSimulationChargeInput[] = (value.Charges || []).map((charge: any) => ({
      QuoteChargeId: 0,
      Description: charge.Description || '',
      IsRecurring: Boolean(charge.IsRecurring),
      ChargeFrequencyCode: charge.ChargeFrequencyCode || '',
      StartPeriodNo: charge.StartPeriodNo || null,
      EndPeriodNo: charge.EndPeriodNo || null,
      Amount: this.numberValue(charge.Amount),
      LessorCostAmount: this.numberValue(charge.LessorCostAmount)
    }));
    const taxComponents: PricingSimulationTaxComponent[] = (value.TaxComponents || []).map((tax: any) => ({
      TaxCode: String(tax.TaxCode || '').trim(),
      TaxRate: this.numberValue(tax.TaxRate),
      TaxJurisdictionId: 0,
      AppliesToRental: Boolean(tax.AppliesToRental),
      AppliesToServices: Boolean(tax.AppliesToServices),
      AppliesToCharges: Boolean(tax.AppliesToCharges)
    }));
    const rentalSteps: PricingSimulationRentalStep[] = (value.RentalSteps || []).map((step: any) => ({
      FromPeriod: this.numberValue(step.FromPeriod),
      ToPeriod: this.numberValue(step.ToPeriod),
      RentalAmount: this.numberValue(step.RentalAmount)
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
      RateFactorPerPeriod: this.numberValue(value.RateFactorPerPeriod),
      AnnualFlatRate: this.numberValue(value.AnnualFlatRate),
      EstimatedResidualValuePercent: this.numberValue(value.EstimatedResidualValuePercent),
      EstimatedResidualValueAmount: this.numberValue(value.EstimatedResidualValueAmount),
      NonRefundableDownPaymentAmount: this.numberValue(value.NonRefundableDownPaymentAmount),
      ContractualBulletPaymentAmount: this.numberValue(value.ContractualBulletPaymentAmount),
      RefundableSecurityDepositAmount: this.numberValue(value.RefundableSecurityDepositAmount),
      UsageAllowance: this.numberValue(value.UsageAllowance),
      ExpectedUsage: this.numberValue(value.ExpectedUsage),
      ExcessUsageRate: this.numberValue(value.ExcessUsageRate),
      UsageUnit: value.UsageUnit || '',
      ExpectedUsagePerPeriod: this.numberValue(value.ExpectedUsagePerPeriod),
      IncludedUsagePerPeriod: this.numberValue(value.IncludedUsagePerPeriod),
      UsageRatePerUnit: this.numberValue(value.UsageRatePerUnit),
      FixedBaseRentalAmount: this.numberValue(value.FixedBaseRentalAmount),
      TargetAnnualIrr: this.numberValue(value.TargetAnnualIrr),
      ManualPeriodicRentalAmount: this.numberValue(value.ManualPeriodicRentalAmount),
      RentalSteps: rentalSteps,
      IsTaxExempt: Boolean(value.IsTaxExempt),
      TaxComponents: taxComponents,
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
    this.taxCodeOptions = this.loggedInUserService.getPicklistOptions('TaxType') || [];
  }

  private loadPermittedMethods(assetCategoryId: number): void {
    const requestId = ++this.methodOptionsRequestId;
    this.methodOptionsLoading = true;
    this.simulatorService.getMethodOptions(assetCategoryId).subscribe({
      next: options => {
        if (requestId === this.methodOptionsRequestId) this.applyPermittedMethods(options);
      },
      error: error => {
        if (requestId === this.methodOptionsRequestId) this.messageService?.showError(error);
      },
      complete: () => {
        if (requestId === this.methodOptionsRequestId) this.methodOptionsLoading = false;
      }
    });
  }

  private applyPermittedMethods(options: PricingSimulatorMethodOptions): void {
    const permitted = options?.Methods || [];
    if (!permitted.length) return;

    this.pricingMethodOptions = permitted.map((method, index) => ({
      Id: index + 1,
      Value: method.Code,
      Text: method.Name
    }));
    this.applyTenantDefaultsAndLimits(options);
    this.configuredDefaultPricingMethod = options.DefaultPricingMethodCode || permitted[0].Code;
    const selected = String(this.form.get('PricingModeCode')?.value || '').toUpperCase();
    if (!permitted.some(method => method.Code === selected)) {
      this.form.get('PricingModeCode')?.setValue(this.configuredDefaultPricingMethod);
    }
  }

  private applyTenantDefaultsAndLimits(options: PricingSimulatorMethodOptions): void {
    this.tenantDefaults = { ...this.tenantDefaults, ...(options.Defaults || {}) };
    this.tenantLimits = { ...this.tenantLimits, ...(options.Limits || {}) };
    this.updateTenantLimitValidators();

    this.applyDefaultToPristineControl('AnnualFundingRate', this.tenantDefaults.AnnualFundingRate);
    this.applyDefaultToPristineControl('TargetAnnualIrr', this.tenantDefaults.TargetAnnualIrr);
    this.applyDefaultToPristineControl('EstimatedResidualValuePercent', this.tenantDefaults.EstimatedResidualValuePercent);
    this.applyDefaultToPristineControl('TermMonths', this.tenantDefaults.TermMonths);
    this.applyDefaultToPristineControl('BillingFrequency', this.tenantDefaults.BillingFrequency);
    this.applyDefaultToPristineControl('PaymentTimingCode', this.tenantDefaults.PaymentTimingCode);
  }

  private applyDefaultToPristineControl(controlName: string, value: unknown): void {
    const control = this.form.get(controlName);
    if (control?.pristine) control.setValue(value, { emitEvent: false });
  }

  private updateTenantLimitValidators(): void {
    const term = this.form.get('TermMonths');
    term?.setValidators([
      Validators.required,
      Validators.min(this.tenantLimits.MinimumTermMonths),
      Validators.max(this.tenantLimits.MaximumTermMonths)
    ]);
    term?.updateValueAndValidity({ emitEvent: false });

    const fundingRate = this.form.get('AnnualFundingRate');
    fundingRate?.setValidators([
      Validators.min(this.tenantLimits.MinimumAnnualFundingRate),
      Validators.max(this.tenantLimits.MaximumAnnualFundingRate)
    ]);
    fundingRate?.updateValueAndValidity({ emitEvent: false });

    const residualPercent = this.form.get('EstimatedResidualValuePercent');
    residualPercent?.setValidators([
      Validators.min(this.tenantLimits.MinimumResidualValuePercent),
      Validators.max(this.tenantLimits.MaximumResidualValuePercent)
    ]);
    residualPercent?.updateValueAndValidity({ emitEvent: false });
    this.updatePricingMethodValidators();
  }

  private defaultTenantDefaults(): PricingSimulatorDefaults {
    return {
      AnnualFundingRate: 0,
      TargetAnnualIrr: 0,
      EstimatedResidualValuePercent: 0,
      TermMonths: 36,
      BillingFrequency: 'MONTHLY',
      PaymentTimingCode: 'ARREARS',
      MonetaryRoundingDecimalPlaces: 4
    };
  }

  private defaultTenantLimits(): PricingSimulatorLimits {
    return {
      MinimumAnnualFundingRate: 0,
      MaximumAnnualFundingRate: 1000,
      MinimumTargetAnnualIrr: 0,
      MaximumTargetAnnualIrr: 1000,
      MinimumResidualValuePercent: 0,
      MaximumResidualValuePercent: 100,
      MinimumTermMonths: 1,
      MaximumTermMonths: 600,
      MinimumMonetaryRoundingDecimalPlaces: 0,
      MaximumMonetaryRoundingDecimalPlaces: 4
    };
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
