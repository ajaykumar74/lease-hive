import { Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';

import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { MessageComponent } from '@/shared/message.component';
import { SpinnerComponent } from '@/shared/spinner.component';
import { QuoteService } from './quote.service';
import {
  IApplyLeasePricingResult,
  ILeasePricingInput,
  ILeasePricingResult,
  ILeasePricingScenario,
  IQuotationCommercialActionResult,
  IQuotationCommercialStatus,
  IQuotationIssuedPdf,
  IQuotationWorkspace,
  IQuotationWorkspaceAsset,
  IQuotationWorkspaceCharge,
  IQuotationWorkspaceHeader,
  IQuotationWorkspaceService
} from './quotation-workspace';

@Component({
  selector: 'app-quotation-workspace',
  standalone: false,
  templateUrl: './quotation-workspace.component.html'
})
export class QuotationWorkspaceComponent implements OnInit {
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild('messagePanel') messageService: MessageComponent;
  @ViewChild('workflowToast') workflowToast?: MessageComponent;

  readonly tabs = [
    'Details', 'Assets', 'Lease Pricing', 'Services & Charges', 'Terms & Conditions', 'Review & Issue'
  ];
  activeTab = 0;
  isLoading = false;
  isSaving = false;
  isCalculating = false;
  isSavingScenario = false;
  isSavingAndApplyingScenario = false;
  isApplyingScenario = false;
  isCommercialAction = false;
  isPdfAction = false;
  quoteId = 0;
  isReviewRoute = false;
  readOnly = false;
  selectedPricingAssetKey = '';
  scenarioName = '';
  calculationResult: ILeasePricingResult | null = null;
  scenarios: ILeasePricingScenario[] = [];
  commercialStatus: IQuotationCommercialStatus | null = null;
  issuedPdf: IQuotationIssuedPdf | null = null;
  commercialComments = '';
  acceptedByName = '';
  acceptanceMethodCode = 'MANUAL';
  acceptanceRemarks = '';
  private isHydrating = false;
  private appliedPricingInputSignatures = new Map<string, string>();
  removedAssetIds: number[] = [];
  removedServiceIds: number[] = [];
  removedChargeIds: number[] = [];

  partyOptions: ISelectItem[] = [];
  opportunityOptions: ISelectItem[] = [];
  requirementOptions: ISelectItem[] = [];
  organisationOptions: ISelectItem[] = [];
  assetCategoryOptions: ISelectItem[] = [];
  assetTypeOptions: ISelectItem[] = [];
  assetMakeOptions: ISelectItem[] = [];
  assetModelOptions: ISelectItem[] = [];
  leaseServiceOptions: ISelectItem[] = [];
  billingFrequencyOptions: ISelectItem[] = [];
  leaseTypeOptions: ISelectItem[] = [];
  paymentTimingOptions: ISelectItem[] = [];
  chargeFrequencyOptions: ISelectItem[] = [];
  taxCodeOptions: ISelectItem[] = [];
  pricingMethodOptions: ISelectItem[] = [
    { Id: 1, Value: 'MANUAL', Text: 'Manual rental' } as ISelectItem,
    { Id: 2, Value: 'CALCULATED', Text: 'Calculated rental' } as ISelectItem
  ];

  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly quoteService: QuoteService,
    private readonly loggedInUserService: LoggedInUserService,
    private readonly destroyRef: DestroyRef
  ) {
    this.form = this.fb.group({
      Quote: this.createHeader(),
      Assets: this.fb.array<FormGroup>([]),
      Services: this.fb.array<FormGroup>([]),
      Charges: this.fb.array<FormGroup>([])
    });
  }

  get header(): FormGroup { return this.form.get('Quote') as FormGroup; }
  get assets(): FormArray<FormGroup> { return this.form.get('Assets') as FormArray<FormGroup>; }
  get services(): FormArray<FormGroup> { return this.form.get('Services') as FormArray<FormGroup>; }
  get charges(): FormArray<FormGroup> { return this.form.get('Charges') as FormArray<FormGroup>; }

  ngOnInit(): void {
    this.quoteId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.isReviewRoute = this.route.snapshot.data['review'] === true;
    if (this.isReviewRoute) this.activeTab = 5;
    this.loadLookupOptions();
    this.assets.valueChanges.subscribe(() => this.refreshCalculatedPricingStaleness());
    this.services.valueChanges.subscribe(() => this.refreshCalculatedPricingStaleness());
    this.charges.valueChanges.subscribe(() => this.refreshCalculatedPricingStaleness());
    ['CurrencyCode', 'PaymentTimingCode', 'SecurityDepositAmount'].forEach(name =>
      this.header.get(name)?.valueChanges.subscribe(() => this.refreshCalculatedPricingStaleness()));
    if (this.quoteId > 0) this.loadWorkspace();
  }

  selectTab(index: number): void { this.activeTab = index; }

  addAsset(asset?: Partial<IQuotationWorkspaceAsset>): void {
    const lineNo = this.assets.length + 1;
    this.assets.push(this.fb.group({
      Id: [asset?.Id || 0], ClientKey: [asset?.ClientKey || this.newClientKey()], RowVersionStr: [asset?.RowVersionStr || null],
      LeaseRequirementAssetId: [asset?.LeaseRequirementAssetId || 0], LineNo: [asset?.LineNo || lineNo],
      AssetCategoryId: [asset?.AssetCategoryId || 0, [Validators.required, Validators.min(1)]],
      AssetTypeId: [asset?.AssetTypeId || 0], AssetMakeId: [asset?.AssetMakeId || 0], AssetModelId: [asset?.AssetModelId || 0],
      Description: [asset?.Description || '', Validators.maxLength(500)], Quantity: [asset?.Quantity || 1, [Validators.required, Validators.min(1)]],
      UnitAssetCost: [asset?.UnitAssetCost || 0, [Validators.required, Validators.min(0)]],
      TermMonths: [asset?.TermMonths || this.header.value.RequestedTermMonths || 1, [Validators.required, Validators.min(1)]],
      BillingFrequency: [asset?.BillingFrequency || this.header.value.BillingFrequency || '', Validators.required],
      ManualPeriodicRentalAmount: [asset?.ManualPeriodicRentalAmount || 0, [Validators.required, Validators.min(0)]],
      PricingMethodCode: [asset?.PricingMethodCode || 'MANUAL'],
      CalculatedPeriodicRentalAmount: [asset?.CalculatedPeriodicRentalAmount || 0],
      AnnualFundingRate: [asset?.AnnualFundingRate || 0, Validators.min(0)],
      EstimatedResidualValueAmount: [asset?.EstimatedResidualValueAmount || 0, Validators.min(0)],
      NonRefundableDownPaymentAmount: [asset?.NonRefundableDownPaymentAmount || 0, Validators.min(0)],
      ContractualBulletPaymentAmount: [asset?.ContractualBulletPaymentAmount || 0, Validators.min(0)],
      UsageAllowance: [asset?.UsageAllowance || 0, Validators.min(0)],
      ExpectedUsage: [asset?.ExpectedUsage || 0, Validators.min(0)],
      ExcessUsageRate: [asset?.ExcessUsageRate || 0, Validators.min(0)],
      PricingInputHash: [asset?.PricingInputHash || ''], PricingCalculatedAt: [asset?.PricingCalculatedAt || null],
      AppliedPricingScenarioId: [asset?.AppliedPricingScenarioId || null], PricingIsStale: [asset?.PricingIsStale ?? false],
      TaxCode: [asset?.TaxCode || '']
    }));
    if (!this.selectedPricingAssetKey) this.selectedPricingAssetKey = asset?.ClientKey || this.assets.at(this.assets.length - 1).value.ClientKey;
  }

  removeAsset(index: number): void {
    const asset = this.assets.at(index).getRawValue();
    if (asset.Id) this.removedAssetIds.push(asset.Id);
    this.removeDependentRows(asset.Id, asset.ClientKey);
    this.assets.removeAt(index);
    this.assets.controls.forEach((control, position) => control.patchValue({ LineNo: position + 1 }));
  }

  addService(service?: Partial<IQuotationWorkspaceService>): void {
    this.services.push(this.fb.group({
      Id: [service?.Id || 0], ClientKey: [service?.ClientKey || this.newClientKey()], RowVersionStr: [service?.RowVersionStr || null],
      QuoteAssetId: [service?.QuoteAssetId || 0], QuoteAssetClientKey: [service?.QuoteAssetClientKey || ''],
      LeaseServiceId: [service?.LeaseServiceId || 0, [Validators.required, Validators.min(1)]],
      ServiceNameSnapshot: [service?.ServiceNameSnapshot || ''], IsIncluded: [service?.IsIncluded ?? true],
      IsSeparatelyChargeable: [service?.IsSeparatelyChargeable ?? false],
      ChargeFrequencyCode: [service?.ChargeFrequencyCode || this.header.value.BillingFrequency || ''],
      UnitAmount: [service?.UnitAmount || 0, [Validators.required, Validators.min(0)]],
      Quantity: [service?.Quantity || 1, [Validators.required, Validators.min(0.000001)]],
      ServiceTerms: [service?.ServiceTerms || '', Validators.maxLength(1000)], LeaseServiceDisplayName: [service?.LeaseServiceDisplayName || '']
    }));
  }

  removeService(index: number): void {
    const service = this.services.at(index).getRawValue();
    if (service.Id) this.removedServiceIds.push(service.Id);
    this.services.removeAt(index);
  }

  addCharge(charge?: Partial<IQuotationWorkspaceCharge>): void {
    this.charges.push(this.fb.group({
      Id: [charge?.Id || 0], ClientKey: [charge?.ClientKey || this.newClientKey()], RowVersionStr: [charge?.RowVersionStr || null],
      QuoteAssetId: [charge?.QuoteAssetId || 0], QuoteAssetClientKey: [charge?.QuoteAssetClientKey || ''],
      ChargeType: [charge?.ChargeType || '', [Validators.required, Validators.maxLength(50)]],
      ChargeDescription: [charge?.ChargeDescription || '', [Validators.required, Validators.maxLength(200)]],
      CalculationTypeCode: [charge?.CalculationTypeCode || 'FIXED', Validators.required],
      RateOrAmount: [charge?.RateOrAmount || 0, [Validators.required, Validators.min(0)]],
      IsRecurring: [charge?.IsRecurring ?? false], ChargeFrequencyCode: [charge?.ChargeFrequencyCode || this.header.value.BillingFrequency || ''],
      TaxCode: [charge?.TaxCode || ''], StartPeriodNo: [charge?.StartPeriodNo || null], EndPeriodNo: [charge?.EndPeriodNo || null]
    }));
  }

  removeCharge(index: number): void {
    const charge = this.charges.at(index).getRawValue();
    if (charge.Id) this.removedChargeIds.push(charge.Id);
    this.charges.removeAt(index);
  }

  assetOptions(): ISelectItem[] {
    return this.assets.controls.map(control => {
      const row = control.getRawValue();
      return { Id: row.Id || 0, Value: row.ClientKey, Text: `Line ${row.LineNo}: ${row.Description || 'Asset'}` } as ISelectItem;
    });
  }

  bindAssetToRow(row: FormGroup, clientKey: string): void {
    const asset = this.assets.controls.map(control => control.getRawValue()).find(value => value.ClientKey === clientKey);
    row.patchValue({ QuoteAssetClientKey: clientKey || '', QuoteAssetId: asset?.Id || 0 });
  }

  totalPeriodicRental(): number {
    return this.assets.controls.reduce((total, row) => total + this.rentalForAsset(row.getRawValue()) * (Number(row.value.Quantity) || 0), 0)
      + this.charges.controls.filter(row => !!row.value.IsRecurring).reduce((total, row) => total + (Number(row.value.RateOrAmount) || 0), 0);
  }

  totalOneOff(): number {
    return this.charges.controls.filter(row => !row.value.IsRecurring).reduce((total, row) => total + (Number(row.value.RateOrAmount) || 0), 0);
  }

  estimatedContractValue(): number {
    return this.totalPeriodicRental() * (Number(this.header.value.RequestedTermMonths) || 0) + this.totalOneOff();
  }

  rentalForAsset(asset: Partial<IQuotationWorkspaceAsset>): number {
    return String(asset?.PricingMethodCode || '').toUpperCase() === 'CALCULATED'
      ? Number(asset?.CalculatedPeriodicRentalAmount || 0)
      : Number(asset?.ManualPeriodicRentalAmount || 0);
  }

  pricingMethodLabel(asset: Partial<IQuotationWorkspaceAsset>): string {
    if (String(asset?.PricingMethodCode || '').toUpperCase() !== 'CALCULATED') return 'Manual';
    return asset?.PricingIsStale ? 'Calculated (stale)' : 'Calculated';
  }

  hasUnappliedCalculatedPricing(): boolean {
    return (this.assets.getRawValue() as IQuotationWorkspaceAsset[]).some(asset =>
      String(asset.PricingMethodCode || '').toUpperCase() === 'CALCULATED'
      && !asset.AppliedPricingScenarioId);
  }

  hasStaleCalculatedPricing(): boolean {
    return (this.assets.getRawValue() as IQuotationWorkspaceAsset[]).some(asset =>
      String(asset.PricingMethodCode || '').toUpperCase() === 'CALCULATED'
      && !!asset.AppliedPricingScenarioId
      && asset.PricingIsStale);
  }

  hasPricingReapplicationRequired(): boolean {
    return this.hasUnappliedCalculatedPricing() || this.hasStaleCalculatedPricing();
  }

  partyDisplayName(): string {
    return this.partyOptions.find(option => option.Id === this.header.value.PartyId)?.Text || 'Not selected';
  }

  saveDraft(): void {
    if (this.readOnly) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.messageService.showError('Complete the required quotation fields before saving the draft.');
      return;
    }
    const header = this.header.getRawValue() as IQuotationWorkspaceHeader;
    header.PricingModeCode = this.quotePricingMode();
    header.PeriodicTotalAmount = this.totalPeriodicRental();
    header.UpfrontAmount = this.totalOneOff();
    header.TotalContractValue = this.estimatedContractValue();
    const workspace: IQuotationWorkspace = {
      Quote: header,
      Assets: this.assets.getRawValue() as IQuotationWorkspaceAsset[],
      Services: this.services.getRawValue() as IQuotationWorkspaceService[],
      Charges: this.charges.getRawValue() as IQuotationWorkspaceCharge[],
      RemovedAssetIds: this.removedAssetIds,
      RemovedServiceIds: this.removedServiceIds,
      RemovedChargeIds: this.removedChargeIds
    };
    this.isSaving = true;
    this.spinner?.show();
    this.quoteService.saveWorkspace(workspace).pipe(
      finalize(() => { this.isSaving = false; this.spinner?.hide(); })
    ).subscribe({
      next: response => {
        this.hydrate(response.data as IQuotationWorkspace);
        this.quoteId = Number(response.data?.Quote?.Id) || this.quoteId;
        this.loadCommercialStatus();
        this.messageService.showSuccess('Quotation draft saved.');
        if (this.quoteId > 0 && !this.route.snapshot.paramMap.get('id')) {
          this.router.navigate(['/business/origination/quotes/edit', this.quoteId], { replaceUrl: true });
        }
      },
      error: error => this.messageService.showError(error)
    });
  }

  get pricingAsset(): FormGroup | null {
    return this.assets.controls.find(control => control.value.ClientKey === this.selectedPricingAssetKey) || this.assets.at(0) || null;
  }

  get selectedPricingAssetIndex(): number {
    return this.assets.controls.findIndex(control => control.value.ClientKey === this.selectedPricingAssetKey);
  }

  selectPricingAsset(clientKey: string): void {
    this.selectedPricingAssetKey = clientKey || '';
    this.calculationResult = null;
    this.scenarioName = '';
    this.scenarios = [];
    this.loadPricingScenarios();
  }

  calculateRental(): void {
    const input = this.createPricingInput();
    if (!input) return;
    this.isCalculating = true;
    this.spinner?.show();
    this.quoteService.calculateLeasePricing(input).pipe(
      finalize(() => { this.isCalculating = false; this.spinner?.hide(); })
    ).subscribe({
      next: response => {
        this.calculationResult = response.data as ILeasePricingResult;
        this.messageService.showSuccess('Rental calculated by the pricing engine. Save a scenario or apply a matching scenario to use the price.');
      },
      error: error => this.messageService.showError(error)
    });
  }

  saveScenario(): void {
    const input = this.createPricingInput();
    if (!input) return;
    if (!this.scenarioName.trim()) {
      this.messageService.showError('Enter a scenario name before saving.');
      return;
    }
    this.isSavingScenario = true;
    this.spinner?.show();
    this.quoteService.saveLeasePricingScenario(this.scenarioName, input).pipe(
      finalize(() => { this.isSavingScenario = false; this.spinner?.hide(); })
    ).subscribe({
      next: response => {
        this.calculationResult = response.data?.Result || this.calculationResult;
        this.scenarioName = '';
        this.messageService.showSuccess('Pricing scenario saved.');
        this.loadPricingScenarios();
      },
      error: error => this.messageService.showError(error)
    });
  }

  saveAndApplyCalculatedPrice(): void {
    const input = this.createPricingInput();
    if (!input) return;
    if (!this.calculationResult) {
      this.messageService.showError('Calculate the rental before applying a price.');
      return;
    }
    const scenarioName = this.scenarioName.trim();
    if (!scenarioName) {
      this.messageService.showError('Enter a scenario name before saving and applying the price.');
      return;
    }

    this.isSavingAndApplyingScenario = true;
    this.spinner?.show();
    this.quoteService.saveLeasePricingScenario(scenarioName, input).pipe(
      switchMap(response => {
        const savedScenario = response?.data as ILeasePricingScenario;
        if (!savedScenario?.Id) throw new Error('The pricing scenario could not be saved.');
        return this.quoteService.applyLeasePricingScenario(this.quoteId, input.QuoteAssetId, savedScenario.Id, input);
      }),
      finalize(() => { this.isSavingAndApplyingScenario = false; this.spinner?.hide(); })
    ).subscribe({
      next: response => {
        this.scenarioName = '';
        this.applyPricingResult(response.data as IApplyLeasePricingResult);
      },
      error: error => this.messageService.showError(error)
    });
  }

  applyScenario(scenario: ILeasePricingScenario): void {
    const input = this.createPricingInput();
    if (!input) return;
    this.isApplyingScenario = true;
    this.spinner?.show();
    this.quoteService.applyLeasePricingScenario(this.quoteId, input.QuoteAssetId, scenario.Id, input).pipe(
      finalize(() => { this.isApplyingScenario = false; this.spinner?.hide(); })
    ).subscribe({
      next: response => this.applyPricingResult(response.data as IApplyLeasePricingResult),
      error: error => this.messageService.showError(error)
    });
  }

  private applyPricingResult(applied: IApplyLeasePricingResult): void {
    const asset = this.pricingAsset;
    if (!asset || !applied?.Result) return;
    asset.patchValue({
      PricingMethodCode: applied.Result.PricingModeCode,
      CalculatedPeriodicRentalAmount: applied.Result.PeriodicBaseRental,
      AnnualFundingRate: this.numberValue(asset.value.AnnualFundingRate),
      EstimatedResidualValueAmount: applied.Result.EstimatedResidualValueAmount,
      NonRefundableDownPaymentAmount: applied.Result.UpfrontReductionAmount,
      ContractualBulletPaymentAmount: applied.Result.ContractualBulletPaymentAmount,
      PricingInputHash: applied.PricingInputHash,
      PricingCalculatedAt: new Date(),
      AppliedPricingScenarioId: applied.ScenarioId,
      PricingIsStale: false,
      RowVersionStr: applied.AssetRowVersionStr
    }, { emitEvent: false });
    this.header.patchValue({
      RowVersionStr: applied.QuoteRowVersionStr,
      PeriodicTotalAmount: applied.QuotePeriodicTotalAmount,
      UpfrontAmount: applied.QuoteUpfrontAmount,
      TotalContractValue: applied.QuoteTotalContractValue,
      PricingModeCode: this.quotePricingMode()
    }, { emitEvent: false });
    this.calculationResult = applied.Result;
    this.recordAppliedPricingInputSignature(asset.getRawValue() as IQuotationWorkspaceAsset);
    this.markPricingInputsAsApplied(asset);
    this.messageService.showSuccess('Price applied to the selected asset. Save Draft to retain all other unsaved quotation changes together.');
    this.loadPricingScenarios();
    this.loadCommercialStatus();
  }

  private loadPricingScenarios(): void {
    const asset = this.pricingAsset?.getRawValue() as IQuotationWorkspaceAsset;
    if (!this.quoteId || !asset?.Id) return;
    this.quoteService.getLeasePricingScenarios(this.quoteId, asset.Id).subscribe({
      next: response => this.scenarios = (response.data || []) as ILeasePricingScenario[],
      error: error => this.messageService.showError(error)
    });
  }

  private createPricingInput(): ILeasePricingInput | null {
    const asset = this.pricingAsset?.getRawValue() as IQuotationWorkspaceAsset;
    if (!this.quoteId || !asset?.Id) {
      this.messageService.showError('Save the quotation draft and asset line before using the pricing engine.');
      return null;
    }
    const services = (this.services.getRawValue() as IQuotationWorkspaceService[])
      .filter(service => service.QuoteAssetId === asset.Id || service.QuoteAssetClientKey === asset.ClientKey)
      .map(service => ({
        QuoteServiceId: service.Id || 0, ServiceName: service.ServiceNameSnapshot || service.LeaseServiceDisplayName || '',
        IsIncluded: !!service.IsIncluded, IsSeparatelyChargeable: !!service.IsSeparatelyChargeable,
        ChargeFrequencyCode: service.ChargeFrequencyCode || '', UnitAmount: this.numberValue(service.UnitAmount), Quantity: this.numberValue(service.Quantity)
      }));
    const charges = (this.charges.getRawValue() as IQuotationWorkspaceCharge[])
      .filter(charge => charge.QuoteAssetId === asset.Id || charge.QuoteAssetClientKey === asset.ClientKey)
      .map(charge => ({
        QuoteChargeId: charge.Id || 0, Description: charge.ChargeDescription || '', IsRecurring: !!charge.IsRecurring,
        ChargeFrequencyCode: charge.ChargeFrequencyCode || '', StartPeriodNo: charge.StartPeriodNo, EndPeriodNo: charge.EndPeriodNo,
        Amount: this.numberValue(charge.RateOrAmount)
      }));
    return {
      QuoteId: this.quoteId,
      QuoteAssetId: asset.Id,
      AssetCategoryId: this.numberValue(asset.AssetCategoryId),
      CurrencyCode: this.header.value.CurrencyCode || '',
      PricingModeCode: asset.PricingMethodCode || 'MANUAL',
      PaymentTimingCode: this.header.value.PaymentTimingCode || 'ARREARS',
      BillingFrequency: asset.BillingFrequency || this.header.value.BillingFrequency || 'MONTHLY',
      Quantity: this.numberValue(asset.Quantity), UnitAssetCost: this.numberValue(asset.UnitAssetCost), TermMonths: this.numberValue(asset.TermMonths),
      AnnualFundingRate: this.numberValue(asset.AnnualFundingRate),
      EstimatedResidualValueAmount: this.numberValue(asset.EstimatedResidualValueAmount),
      NonRefundableDownPaymentAmount: this.numberValue(asset.NonRefundableDownPaymentAmount),
      ContractualBulletPaymentAmount: this.numberValue(asset.ContractualBulletPaymentAmount),
      RefundableSecurityDepositAmount: this.numberValue(this.header.value.SecurityDepositAmount),
      UsageAllowance: this.numberValue(asset.UsageAllowance), ExpectedUsage: this.numberValue(asset.ExpectedUsage),
      ExcessUsageRate: this.numberValue(asset.ExcessUsageRate), ManualPeriodicRentalAmount: this.numberValue(asset.ManualPeriodicRentalAmount),
      Services: services, Charges: charges
    };
  }

  private quotePricingMode(): string {
    const values = this.assets.getRawValue() as IQuotationWorkspaceAsset[];
    const calculated = values.filter(asset => String(asset.PricingMethodCode || '').toUpperCase() === 'CALCULATED').length;
    return calculated === 0 ? 'MANUAL' : calculated === values.length ? 'CALCULATED' : 'MIXED';
  }

  private refreshCalculatedPricingStaleness(): void {
    if (this.isHydrating || this.readOnly) return;
    this.assets.controls.forEach(asset => {
      const value = asset.getRawValue() as IQuotationWorkspaceAsset;
      const key = this.pricingSignatureKey(value);
      if (String(value.PricingMethodCode || '').toUpperCase() !== 'CALCULATED' || !value.AppliedPricingScenarioId || value.PricingIsStale)
        return;

      const appliedSignature = this.appliedPricingInputSignatures.get(key);
      if (appliedSignature
        && this.hasDirtyPricingInputs(asset)
        && appliedSignature !== this.pricingInputSignature(value)) {
        asset.patchValue({ PricingIsStale: true }, { emitEvent: false });
        this.appliedPricingInputSignatures.delete(key);
      }
    });
  }

  /**
   * Only an actual edit to data passed to the pricing engine can invalidate an
   * applied scenario.  Form-array value changes also fire for harmless UI
   * hydration and for descriptive fields on later tabs; treating those as
   * pricing edits caused valid scenarios to become stale while completing the
   * quotation workflow.
   */
  private hasDirtyPricingInputs(asset: FormGroup): boolean {
    const isDirty = (group: FormGroup, names: string[]) => names.some(name => group.get(name)?.dirty);
    const assetInputNames = [
      'AssetCategoryId', 'Quantity', 'UnitAssetCost', 'TermMonths', 'BillingFrequency', 'PricingMethodCode',
      'AnnualFundingRate', 'EstimatedResidualValueAmount', 'NonRefundableDownPaymentAmount',
      'ContractualBulletPaymentAmount', 'UsageAllowance', 'ExpectedUsage', 'ExcessUsageRate',
      'ManualPeriodicRentalAmount'
    ];
    const headerInputNames = ['CurrencyCode', 'PaymentTimingCode', 'SecurityDepositAmount'];
    if (isDirty(asset, assetInputNames) || isDirty(this.header, headerInputNames)) return true;

    const value = asset.getRawValue() as IQuotationWorkspaceAsset;
    const belongsToAsset = (row: { QuoteAssetId: number; QuoteAssetClientKey?: string }) =>
      row.QuoteAssetId === value.Id || row.QuoteAssetClientKey === value.ClientKey;
    const serviceInputNames = [
      'QuoteAssetId', 'QuoteAssetClientKey', 'LeaseServiceId', 'IsIncluded', 'IsSeparatelyChargeable',
      'ChargeFrequencyCode', 'UnitAmount', 'Quantity'
    ];
    const chargeInputNames = [
      'QuoteAssetId', 'QuoteAssetClientKey', 'ChargeDescription', 'IsRecurring', 'ChargeFrequencyCode',
      'StartPeriodNo', 'EndPeriodNo', 'RateOrAmount'
    ];

    return this.services.controls.some(service => belongsToAsset(service.getRawValue()) && isDirty(service, serviceInputNames))
      || this.charges.controls.some(charge => belongsToAsset(charge.getRawValue()) && isDirty(charge, chargeInputNames));
  }

  private markPricingInputsAsApplied(asset: FormGroup): void {
    const markPristine = (group: FormGroup, names: string[]) =>
      names.forEach(name => group.get(name)?.markAsPristine({ onlySelf: true }));
    const assetInputNames = [
      'AssetCategoryId', 'Quantity', 'UnitAssetCost', 'TermMonths', 'BillingFrequency', 'PricingMethodCode',
      'AnnualFundingRate', 'EstimatedResidualValueAmount', 'NonRefundableDownPaymentAmount',
      'ContractualBulletPaymentAmount', 'UsageAllowance', 'ExpectedUsage', 'ExcessUsageRate',
      'ManualPeriodicRentalAmount'
    ];
    markPristine(asset, assetInputNames);
    markPristine(this.header, ['CurrencyCode', 'PaymentTimingCode', 'SecurityDepositAmount']);

    const value = asset.getRawValue() as IQuotationWorkspaceAsset;
    const belongsToAsset = (row: { QuoteAssetId: number; QuoteAssetClientKey?: string }) =>
      row.QuoteAssetId === value.Id || row.QuoteAssetClientKey === value.ClientKey;
    this.services.controls
      .filter(service => belongsToAsset(service.getRawValue()))
      .forEach(service => markPristine(service, ['QuoteAssetId', 'QuoteAssetClientKey', 'LeaseServiceId', 'IsIncluded', 'IsSeparatelyChargeable', 'ChargeFrequencyCode', 'UnitAmount', 'Quantity']));
    this.charges.controls
      .filter(charge => belongsToAsset(charge.getRawValue()))
      .forEach(charge => markPristine(charge, ['QuoteAssetId', 'QuoteAssetClientKey', 'ChargeDescription', 'IsRecurring', 'ChargeFrequencyCode', 'StartPeriodNo', 'EndPeriodNo', 'RateOrAmount']));
  }

  private captureAppliedPricingInputSignatures(): void {
    this.appliedPricingInputSignatures.clear();
    this.assets.controls.forEach(control => {
      const asset = control.getRawValue() as IQuotationWorkspaceAsset;
      this.recordAppliedPricingInputSignature(asset);
    });
  }

  private recordAppliedPricingInputSignature(asset: IQuotationWorkspaceAsset): void {
    if (String(asset?.PricingMethodCode || '').toUpperCase() !== 'CALCULATED'
      || !asset?.AppliedPricingScenarioId || asset.PricingIsStale) return;
    this.appliedPricingInputSignatures.set(this.pricingSignatureKey(asset), this.pricingInputSignature(asset));
  }

  private pricingInputSignature(asset: IQuotationWorkspaceAsset): string {
    const sameAsset = (row: { QuoteAssetId: number; QuoteAssetClientKey?: string }) =>
      row.QuoteAssetId === asset.Id || row.QuoteAssetClientKey === asset.ClientKey;
    const text = (value: unknown) => String(value ?? '').trim().toUpperCase();
    const number = (value: unknown) => this.numberValue(value);
    const services = (this.services.getRawValue() as IQuotationWorkspaceService[])
      .filter(sameAsset)
      .map(service => ({
        Id: service.Id || 0,
        Name: text(service.ServiceNameSnapshot || service.LeaseServiceDisplayName),
        IsIncluded: !!service.IsIncluded,
        IsSeparatelyChargeable: !!service.IsSeparatelyChargeable,
        ChargeFrequencyCode: text(service.ChargeFrequencyCode),
        UnitAmount: number(service.UnitAmount),
        Quantity: number(service.Quantity)
      }))
      .sort((left, right) => left.Id - right.Id || left.Name.localeCompare(right.Name));
    const charges = (this.charges.getRawValue() as IQuotationWorkspaceCharge[])
      .filter(sameAsset)
      .map(charge => ({
        Id: charge.Id || 0,
        Description: text(charge.ChargeDescription),
        IsRecurring: !!charge.IsRecurring,
        ChargeFrequencyCode: text(charge.ChargeFrequencyCode),
        StartPeriodNo: charge.StartPeriodNo || null,
        EndPeriodNo: charge.EndPeriodNo || null,
        Amount: number(charge.RateOrAmount)
      }))
      .sort((left, right) => left.Id - right.Id || left.Description.localeCompare(right.Description));

    return JSON.stringify({
      CurrencyCode: text(this.header.value.CurrencyCode),
      PricingModeCode: text(asset.PricingMethodCode),
      PaymentTimingCode: text(this.header.value.PaymentTimingCode || 'ARREARS'),
      BillingFrequency: text(asset.BillingFrequency || this.header.value.BillingFrequency || 'MONTHLY'),
      AssetCategoryId: number(asset.AssetCategoryId),
      Quantity: number(asset.Quantity),
      UnitAssetCost: number(asset.UnitAssetCost),
      TermMonths: number(asset.TermMonths),
      AnnualFundingRate: number(asset.AnnualFundingRate),
      EstimatedResidualValueAmount: number(asset.EstimatedResidualValueAmount),
      NonRefundableDownPaymentAmount: number(asset.NonRefundableDownPaymentAmount),
      ContractualBulletPaymentAmount: number(asset.ContractualBulletPaymentAmount),
      RefundableSecurityDepositAmount: number(this.header.value.SecurityDepositAmount),
      UsageAllowance: number(asset.UsageAllowance),
      ExpectedUsage: number(asset.ExpectedUsage),
      ExcessUsageRate: number(asset.ExcessUsageRate),
      ManualPeriodicRentalAmount: number(asset.ManualPeriodicRentalAmount),
      Services: services,
      Charges: charges
    });
  }

  private pricingSignatureKey(asset: IQuotationWorkspaceAsset): string {
    return asset.ClientKey || `asset-${asset.Id}`;
  }

  private numberValue(value: unknown): number { return Number(value) || 0; }

  preview(): void { this.activeTab = 5; this.previewPdf(); }
  printPreview(): void { window.print(); }
  previewPdf(): void {
    if (!this.quoteId) {
      this.messageService.showError('Save the quotation draft before generating a PDF preview.');
      return;
    }
    this.isPdfAction = true;
    this.spinner?.show();
    this.quoteService.previewQuotationPdf(this.quoteId).pipe(
      finalize(() => { this.isPdfAction = false; this.spinner?.hide(); })
    ).subscribe({
      next: pdf => this.openPdf(pdf),
      error: error => this.messageService.showError(error)
    });
  }

  downloadIssuedPdf(): void {
    if (!this.quoteId || !this.issuedPdf) return;
    this.isPdfAction = true;
    this.spinner?.show();
    this.quoteService.downloadIssuedQuotationPdf(this.quoteId).pipe(
      finalize(() => { this.isPdfAction = false; this.spinner?.hide(); })
    ).subscribe({
      next: pdf => this.openPdf(pdf),
      error: error => this.messageService.showError(error)
    });
  }

  sendToCustomer(): void {
    if (!this.quoteId) return;
    this.isPdfAction = true;
    this.spinner?.show();
    this.quoteService.sendQuotationToCustomer(this.quoteId).pipe(
      finalize(() => { this.isPdfAction = false; this.spinner?.hide(); })
    ).subscribe({
      next: response => {
        const queueId = response?.data?.EmailJobQueueId;
        this.messageService.showSuccess(queueId ? `Quotation email queued (job ${queueId}).` : 'Quotation email was not queued because no active quotation email template is configured.');
      },
      error: error => this.messageService.showError(error)
    });
  }

  private openPdf(pdf: Blob): void {
    const url = URL.createObjectURL(pdf);
    window.open(url, '_blank', 'noopener');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
  cancel(): void { this.location.back(); }
  openWorkflow(): void {
    if (!this.quoteId) { this.messageService.showError('Save the draft before starting the existing approval and issue workflow.'); return; }
    this.router.navigate(['/business/origination/quotes/review', this.quoteId]);
  }

  loadCommercialStatus(): void {
    if (!this.quoteId) { this.commercialStatus = null; return; }
    this.quoteService.getCommercialStatus(this.quoteId).subscribe({
      next: response => {
        this.commercialStatus = response.data as IQuotationCommercialStatus;
        if (this.commercialStatus) {
          this.header.patchValue({
            StatusCode: this.commercialStatus.StatusCode,
            StatusName: this.commercialStatus.StatusName,
            IsEditable: this.commercialStatus.IsEditable,
            PeriodicTotalAmount: this.commercialStatus.PeriodicTotalAmount,
            UpfrontAmount: this.commercialStatus.UpfrontAmount,
            TotalContractValue: this.commercialStatus.TotalContractValue
          }, { emitEvent: false });
          this.readOnly = !this.commercialStatus.IsEditable;
          if (this.readOnly) this.form.disable({ emitEvent: false });
          else this.form.enable({ emitEvent: false });
          if (this.commercialStatus.StatusCode === 'ISSUED' || this.commercialStatus.StatusCode === 'ACCEPTED') this.loadIssuedPdf();
          else this.issuedPdf = null;
        }
      },
      error: error => this.messageService.showError(error)
    });
  }

  submitForCommercialApproval(): void {
    if (!this.quoteId) return;
    this.executeCommercialAction(this.quoteService.submitCommercial(this.quoteId));
  }

  approveCommercial(): void { this.sendCommercialDecision('APPROVE'); }
  rejectCommercial(): void { this.sendCommercialDecision('REJECT'); }
  returnCommercial(): void { this.sendCommercialDecision('RETURN'); }

  private sendCommercialDecision(actionCode: string): void {
    if (!this.quoteId) return;
    this.executeCommercialAction(this.quoteService.commercialAction(this.quoteId, actionCode, this.commercialComments));
  }

  issueQuotation(): void {
    if (!this.quoteId) return;
    this.executeCommercialAction(this.quoteService.issueCommercial(this.quoteId));
  }

  recordAcceptance(): void {
    if (!this.quoteId) return;
    if (!this.acceptedByName.trim()) {
      this.messageService.showError('Enter the customer contact name to record acceptance.');
      return;
    }
    this.executeCommercialAction(this.quoteService.recordQuoteAcceptance({
      QuoteId: this.quoteId,
      AcceptedByName: this.acceptedByName,
      AcceptedByPartyContactId: 0,
      AcceptanceMethodCode: this.acceptanceMethodCode || 'MANUAL',
      DocumentId: 0,
      Remarks: this.acceptanceRemarks
    }));
  }

  createRevision(): void {
    if (!this.quoteId) return;
    this.isCommercialAction = true;
    this.spinner?.show();
    this.quoteService.createRevision(this.quoteId).pipe(
      finalize(() => { this.isCommercialAction = false; this.spinner?.hide(); })
    ).subscribe({
      next: response => {
        const revisionId = Number(response?.data?.QuoteId || response?.Id);
        if (revisionId > 0) this.router.navigate(['/business/origination/quotes/edit', revisionId]);
        else this.messageService.showSuccess('Quotation revision created.');
      },
      error: error => this.messageService.showError(error)
    });
  }

  createContractDraft(): void {
    if (!this.quoteId) return;
    this.isCommercialAction = true;
    this.spinner?.show();
    this.quoteService.createContractDraft(this.quoteId).pipe(
      finalize(() => { this.isCommercialAction = false; this.spinner?.hide(); })
    ).subscribe({
      next: response => {
        const handoff = response.data;
        this.showWorkflowSuccess(handoff?.ReusedExistingDraft
          ? `Existing contract draft ${handoff.ContractNumber} opened by reference.`
          : `Contract draft ${handoff?.ContractNumber || ''} created from the accepted quotation.`);
        this.loadCommercialStatus();
      },
      error: error => this.showWorkflowError(error)
    });
  }

  private executeCommercialAction(request: any): void {
    this.isCommercialAction = true;
    this.spinner?.show();
    request.pipe(
      finalize(() => {
        this.isCommercialAction = false;
        this.spinner?.hide();
      })
    ).subscribe({
      next: (response: any) => {
        const result = response.data as IQuotationCommercialActionResult;
        this.showWorkflowSuccess(result?.Message || 'Commercial action completed.');
        this.commercialComments = '';
        this.loadCommercialStatus();
      },
      error: (error: any) => this.showWorkflowError(error)
    });
  }

  private showWorkflowSuccess(message: string): void {
    this.messageService.showSuccess(message);
    this.workflowToast?.showSuccess(message);
  }

  private showWorkflowError(error: unknown): void {
    this.messageService.showError(error);
    this.workflowToast?.showError(error);
  }

  private loadIssuedPdf(): void {
    this.quoteService.getIssuedQuotationPdf(this.quoteId).subscribe({
      next: response => this.issuedPdf = (response.data || null) as IQuotationIssuedPdf | null,
      error: error => this.messageService.showError(error)
    });
  }

  private createHeader(): FormGroup {
    const today = new Date();
    const validUntil = new Date(today); validUntil.setDate(validUntil.getDate() + 30);
    return this.fb.group({
      Id: [0], RowVersionStr: [null], QuoteId: [''], QuoteGroupNo: [0], VersionNo: ['DRAFT'],
      OpportunityId: [0, [Validators.required, Validators.min(1)]], LeaseRequirementId: [0],
      PartyId: [0, [Validators.required, Validators.min(1)]], OriginatingOrganisationId: [0, [Validators.required, Validators.min(1)]],
      QuoteStatusId: [0], StatusCode: ['DRAFT'], StatusName: ['Draft'], IsEditable: [true], QuoteDate: [today, Validators.required],
      ValidUntil: [validUntil, Validators.required], CurrencyCode: ['GBP', [Validators.required, Validators.maxLength(20)]],
      RequestedTermMonths: [36, [Validators.required, Validators.min(1), Validators.max(600)]],
      BillingFrequency: ['', Validators.required], SecurityDepositAmount: [0, Validators.min(0)], Remarks: ['', Validators.maxLength(100)],
      PricingModeCode: ['MANUAL'], LeaseTypeCode: [''], PaymentTimingCode: [''], PeriodicTotalAmount: [0], UpfrontAmount: [0],
      TotalContractValue: [0], TermsAndConditions: [''], DeliveryTerms: [''], ReturnTerms: [''], ServiceLevelTerms: [''], TaxAmount: [0], DiscountAmount: [0]
    });
  }

  private loadLookupOptions(): void {
    this.loggedInUserService.getEntityLookupOptions('parties').subscribe(options => this.partyOptions = options);
    this.loggedInUserService.bindEntityLookup(
      this.header,
      'OpportunityId',
      'opportunities',
      options => this.opportunityOptions = options,
      error => this.messageService?.showError(error),
      this.destroyRef,
      { PartyId: 'PartyId' }
    );
    this.loggedInUserService.bindEntityLookup(
      this.header,
      'LeaseRequirementId',
      'lease-requirements',
      options => this.requirementOptions = options,
      error => this.messageService?.showError(error),
      this.destroyRef,
      { OpportunityId: 'OpportunityId' }
    );
    this.loggedInUserService.getOrganisationOptions().subscribe(options => this.organisationOptions = options);
    this.loggedInUserService.getEntityLookupOptions('asset-categories').subscribe(options => this.assetCategoryOptions = options);
    this.loggedInUserService.getEntityLookupOptions('asset-types').subscribe(options => this.assetTypeOptions = options);
    this.loggedInUserService.getEntityLookupOptions('asset-makes').subscribe(options => this.assetMakeOptions = options);
    this.loggedInUserService.getEntityLookupOptions('asset-models').subscribe(options => this.assetModelOptions = options);
    this.loggedInUserService.getEntityLookupOptions('lease-services').subscribe(options => this.leaseServiceOptions = options);
    this.billingFrequencyOptions = this.withFallback(this.loggedInUserService.getPicklistOptions('BillingFrequency'), ['Monthly', 'Quarterly', 'Annually']);
    this.leaseTypeOptions = this.withFallback(this.loggedInUserService.getPicklistOptions('LeaseTypeCode'), ['Operating', 'Finance']);
    this.paymentTimingOptions = this.withFallback(this.loggedInUserService.getPicklistOptions('PaymentTimingCode'), ['Arrears', 'Advance']);
    this.chargeFrequencyOptions = this.withFallback(this.loggedInUserService.getPicklistOptions('ChargeFrequencyCode'), ['Monthly', 'Once']);
    this.taxCodeOptions = this.loggedInUserService.getPicklistOptions('TaxCode');
  }

  private loadWorkspace(): void {
    this.isLoading = true;
    this.spinner?.show();
    this.quoteService.getWorkspace(this.quoteId).pipe(
      finalize(() => { this.isLoading = false; this.spinner?.hide(); })
    ).subscribe({
      next: response => this.hydrate(response.data as IQuotationWorkspace),
      error: error => this.messageService.showError(error)
    });
  }

  private hydrate(workspace: IQuotationWorkspace): void {
    if (!workspace?.Quote) return;
    this.isHydrating = true;
    try {
      this.header.patchValue({
        ...workspace.Quote,
        QuoteDate: workspace.Quote.QuoteDate ? new Date(workspace.Quote.QuoteDate) : new Date(),
        ValidUntil: workspace.Quote.ValidUntil ? new Date(workspace.Quote.ValidUntil) : new Date()
      }, { emitEvent: false });
      this.readOnly = workspace.Quote.IsEditable === false;
      this.assets.clear({ emitEvent: false }); this.services.clear({ emitEvent: false }); this.charges.clear({ emitEvent: false });
      (workspace.Assets || []).forEach(asset => this.addAsset(asset));
      (workspace.Services || []).forEach(service => this.addService(service));
      (workspace.Charges || []).forEach(charge => this.addCharge(charge));
      this.removedAssetIds = []; this.removedServiceIds = []; this.removedChargeIds = [];
      this.selectedPricingAssetKey = this.assets.length ? this.assets.at(0).value.ClientKey : '';
      if (this.readOnly) this.form.disable({ emitEvent: false }); else this.form.enable({ emitEvent: false });
      // Dependent lookup bindings load their selected rows after an existing draft is hydrated.
      this.header.updateValueAndValidity({ emitEvent: true });
    } finally {
      this.isHydrating = false;
    }
    this.captureAppliedPricingInputSignatures();
    this.loadPricingScenarios();
    this.loadCommercialStatus();
  }

  private removeDependentRows(assetId: number, assetClientKey: string): void {
    for (let index = this.services.length - 1; index >= 0; index--) {
      const service = this.services.at(index).getRawValue();
      if (service.QuoteAssetId === assetId || service.QuoteAssetClientKey === assetClientKey) this.removeService(index);
    }
    for (let index = this.charges.length - 1; index >= 0; index--) {
      const charge = this.charges.at(index).getRawValue();
      if (charge.QuoteAssetId === assetId || charge.QuoteAssetClientKey === assetClientKey) this.removeCharge(index);
    }
  }

  private withFallback(options: ISelectItem[], values: string[]): ISelectItem[] {
    return options?.length ? options : values.map((value, index) => ({ Id: index + 1, Value: value, Text: value } as ISelectItem));
  }

  private newClientKey(): string { return `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
}
