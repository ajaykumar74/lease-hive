import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { IInsurancePolicy } from '../insurancePolicy/insurancePolicy';
import { InsurancePolicyService } from '../insurancePolicy/insurancePolicy.service';
import { IInsurancePolicyAsset } from './insurancePolicyAsset';
import { InsurancePolicyAssetService } from './insurancePolicyAsset.service';

export interface IInsurancePolicyAssetDeliveryContext {
  AssetId: number;
  LeaseContractId: number;
  AssetLabel: string;
}

/**
 * Delivery uses the same policy-asset record as the standalone insurance area.
 * The delivery context deliberately owns the asset and contract values, so they
 * cannot be changed while a user is linking cover during a handover.
 */
@Component({
  selector: 'app-insurance-policy-asset-delivery-form',
  standalone: false,
  templateUrl: './insurancePolicyAsset-delivery-form.component.html'
})
export class InsurancePolicyAssetDeliveryFormComponent implements OnInit, OnChanges {
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) context!: IInsurancePolicyAssetDeliveryContext;
  @Input() coverage: IInsurancePolicyAsset | null = null;
  @Input() existingCoverages: IInsurancePolicyAsset[] = [];
  @Output() saved = new EventEmitter<IInsurancePolicyAsset>();
  @Output() cancelled = new EventEmitter<void>();

  form: any;
  saving = false;
  loadingPolicy = false;
  error = '';
  policyOptions: ISelectItem[] = [];
  coverageTypeOptions: ISelectItem[] = [];
  beneficiaryOptions: ISelectItem[] = [];
  statusOptions: ISelectItem[] = [];
  selectedPolicy: IInsurancePolicy | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly policyAssets: InsurancePolicyAssetService,
    private readonly policies: InsurancePolicyService,
    private readonly loggedInUserService: LoggedInUserService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      InsurancePolicyId: new FormControl(null, [Validators.required, Validators.min(1)]),
      AssetId: new FormControl({ value: 0, disabled: true }, [Validators.required, Validators.min(1)]),
      LeaseContractId: new FormControl({ value: 0, disabled: true }, [Validators.required, Validators.min(1)]),
      CoverageTypeId: new FormControl(null, [Validators.required, Validators.min(1)]),
      CoverageStartDate: new FormControl(null, Validators.required),
      CoverageEndDate: new FormControl(null, Validators.required),
      InsuredValue: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      DeductibleAmount: new FormControl(0, Validators.min(0)),
      CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      BeneficiaryPartyId: new FormControl(null),
      StatusCode: new FormControl('PENDING_VERIFICATION', [Validators.required, Validators.maxLength(20)])
    });
    this.loggedInUserService.bindEntityLookup(this.form, 'InsurancePolicyId', 'insurance-policies', options => this.policyOptions = options, error => this.error = String(error), this.destroyRef);
    this.loggedInUserService.bindEntityLookup(this.form, 'CoverageTypeId', 'insurance-coverage-types', options => this.coverageTypeOptions = options, error => this.error = String(error), this.destroyRef);
    this.loggedInUserService.bindEntityLookup(this.form, 'BeneficiaryPartyId', 'parties', options => this.beneficiaryOptions = options, error => this.error = String(error), this.destroyRef);
    this.statusOptions = this.withWorkflowStatuses(this.loggedInUserService.getPicklistOptions('InsurancePolicyAssetStatusCode'));
    this.form.get('InsurancePolicyId')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((id: number | null) => this.loadPolicy(id));
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form && (changes['context'] || changes['coverage'])) this.resetForm();
  }

  resetForm(): void {
    if (!this.form || !this.context) return;
    const coverage = this.coverage;
    this.error = '';
    this.selectedPolicy = null;
    this.form.reset({
      InsurancePolicyId: coverage?.InsurancePolicyId || null,
      AssetId: this.context.AssetId,
      LeaseContractId: this.context.LeaseContractId,
      CoverageTypeId: coverage?.CoverageTypeId || null,
      CoverageStartDate: coverage?.CoverageStartDate || null,
      CoverageEndDate: coverage?.CoverageEndDate || null,
      InsuredValue: coverage?.InsuredValue || 0,
      DeductibleAmount: coverage?.DeductibleAmount || 0,
      CurrencyCode: coverage?.CurrencyCode || '',
      BeneficiaryPartyId: coverage?.BeneficiaryPartyId || null,
      StatusCode: coverage?.StatusCode || 'PENDING_VERIFICATION'
    }, { emitEvent: !!coverage?.InsurancePolicyId });
  }

  openPolicyCreation(): void {
    // A separate tab preserves the delivery workflow and the locked context.
    window.open('/maintenance-insurance/insurance/policies/create', '_blank', 'noopener');
  }

  save(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Complete the required insurance coverage details.';
      return;
    }
    const value = this.form.getRawValue();
    const start = this.date(value.CoverageStartDate);
    const end = this.date(value.CoverageEndDate);
    if (!start || !end || end < start) {
      this.error = 'Coverage end date must be on or after the coverage start date.';
      return;
    }
    if (this.selectedPolicy && !this.isWithinPolicyDates(start, end)) {
      this.error = 'Coverage dates must fall within the selected policy period.';
      return;
    }
    if (this.isUnavailablePolicy(this.selectedPolicy)) {
      this.error = 'The selected insurance policy is not active for use in delivery.';
      return;
    }
    if (this.requiresBeneficiary(this.selectedPolicy) && !value.BeneficiaryPartyId) {
      this.error = 'This policy requires the applicable lender or beneficiary to be recorded.';
      return;
    }
    if (this.requiresDocuments(this.selectedPolicy) && !this.coverage?.Id && String(value.StatusCode).replace(/[ _-]/g, '').toUpperCase() === 'COVERED') {
      this.error = 'Save the coverage as pending verification, attach the required insurance evidence, then mark it covered.';
      return;
    }
    if (this.isDuplicate(value)) {
      this.error = 'This policy coverage is already linked to the asset for the same coverage type and dates.';
      return;
    }

    const payload = {
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.coverage?.Id || 0,
      RowVersionStr: this.coverage?.RowVersionStr,
      InsurancePolicyId: value.InsurancePolicyId,
      AssetId: this.context.AssetId,
      LeaseContractId: this.context.LeaseContractId,
      CoverageTypeId: value.CoverageTypeId,
      CoverageStartDate: value.CoverageStartDate,
      CoverageEndDate: value.CoverageEndDate,
      InsuredValue: value.InsuredValue,
      DeductibleAmount: value.DeductibleAmount || 0,
      CurrencyCode: value.CurrencyCode,
      BeneficiaryPartyId: value.BeneficiaryPartyId || 0,
      StatusCode: value.StatusCode,
      RecordStatus: this.coverage?.RecordStatus || 'Active'
    } as IInsurancePolicyAsset;

    this.saving = true;
    const request = this.coverage?.Id ? this.policyAssets.update(this.coverage.Id, payload) : this.policyAssets.create(payload);
    request.subscribe({
      next: (response: any) => this.saved.emit(response?.data || payload),
      error: error => { this.error = String(error); this.saving = false; },
      complete: () => this.saving = false
    });
  }

  private loadPolicy(policyId: number | null): void {
    this.selectedPolicy = null;
    if (!policyId || Number(policyId) <= 0) return;
    this.loadingPolicy = true;
    this.policies.getById(Number(policyId)).subscribe({
      next: (response: any) => {
        const policy = (response?.data || response) as IInsurancePolicy;
        this.selectedPolicy = policy || null;
        if (!policy || this.coverage?.InsurancePolicyId === policy.Id) return;
        // These are policy-controlled values. A user can still supply the
        // deductible and beneficiary that apply to this particular asset.
        this.form.patchValue({
          CoverageTypeId: policy.CoverageTypeId || null,
          CoverageStartDate: policy.PolicyStartDate || null,
          CoverageEndDate: policy.PolicyEndDate || null,
          InsuredValue: policy.TotalInsuredValue || 0,
          CurrencyCode: policy.CurrencyCode || '',
          StatusCode: 'PENDING_VERIFICATION'
        }, { emitEvent: false });
      },
      error: () => this.error = 'The selected policy could not be loaded for validation.',
      complete: () => this.loadingPolicy = false
    });
  }

  private isWithinPolicyDates(start: Date, end: Date): boolean {
    const policyStart = this.date(this.selectedPolicy?.PolicyStartDate);
    const policyEnd = this.date(this.selectedPolicy?.PolicyEndDate);
    return (!policyStart || start >= policyStart) && (!policyEnd || end <= policyEnd);
  }

  private isUnavailablePolicy(policy: IInsurancePolicy | null): boolean {
    const status = String((policy as any)?.InsurancePolicyStatusCode || (policy as any)?.StatusCode || '').toUpperCase();
    return /EXPIRED|CANCEL|VOID|LAPSED/.test(status);
  }

  private requiresBeneficiary(policy: IInsurancePolicy | null): boolean {
    return (policy as any)?.RequiresLenderBeneficiary === true || (policy as any)?.BeneficiaryRequired === true;
  }

  private requiresDocuments(policy: IInsurancePolicy | null): boolean {
    return (policy as any)?.RequiresDocuments === true || (policy as any)?.RequiresCertificate === true;
  }

  private isDuplicate(candidate: any): boolean {
    return this.existingCoverages.some(item => item.Id !== this.coverage?.Id
      && item.InsurancePolicyId === candidate.InsurancePolicyId
      && item.CoverageTypeId === candidate.CoverageTypeId
      && this.sameDate(item.CoverageStartDate, candidate.CoverageStartDate)
      && this.sameDate(item.CoverageEndDate, candidate.CoverageEndDate)
      && String(item.RecordStatus || 'Active').toUpperCase() === 'ACTIVE');
  }

  private sameDate(left: unknown, right: unknown): boolean {
    const leftDate = this.date(left);
    const rightDate = this.date(right);
    return !!leftDate && !!rightDate && leftDate.getTime() === rightDate.getTime();
  }

  private date(value: unknown): Date | null {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private withWorkflowStatuses(options: ISelectItem[]): ISelectItem[] {
    const required = [
      { Value: 'COVERED', Text: 'Covered' },
      { Value: 'PENDING_VERIFICATION', Text: 'Pending Verification' },
      { Value: 'NOT_REQUIRED', Text: 'Not Required' }
    ];
    return [...options, ...required.filter(item => !options.some(option => String(option.Value).replace(/[ _-]/g, '').toUpperCase() === String(item.Value).replace(/[ _-]/g, '').toUpperCase()))];
  }
}
