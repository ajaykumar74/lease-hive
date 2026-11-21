import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { IAssetAssignment, IAssetAssignmentDeliveryContext, IAssetUserCompliance } from './assetAssignment';
import { AssetAssignmentService } from './assetAssignment.service';
import { AssetUserService } from '../assetUser/assetUser.service';
import { IAssetUser } from '../assetUser/assetUser';
import { evaluateDrivingEligibility, DrivingEligibility } from '../assetUser/driving-eligibility';
import { PermissionService } from '@/shared/security/permission.service';

@Component({
  selector: 'app-asset-assignment-delivery-form',
  standalone: false,
  templateUrl: './assetAssignment-delivery-form.component.html'
})
export class AssetAssignmentDeliveryFormComponent implements OnInit, OnChanges {
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) context!: IAssetAssignmentDeliveryContext;
  @Input() assignment: IAssetAssignment | null = null;
  @Input() existingAssignments: IAssetAssignment[] = [];
  @Output() saved = new EventEmitter<IAssetAssignment>();
  @Output() cancelled = new EventEmitter<void>();

  form: any;
  saving = false;
  error = '';
  partyLocationOptions: ISelectItem[] = [];
  departmentOptions: ISelectItem[] = [];
  assetUserOptions: ISelectItem[] = [];
  assignmentTypeOptions: ISelectItem[] = [];
  assignmentStatusOptions: ISelectItem[] = [];
  selectedAssetUser: IAssetUser | null = null;
  selectedUserCompliance: IAssetUserCompliance | null = null;
  assetUserLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly assignments: AssetAssignmentService,
    private readonly loggedInUserService: LoggedInUserService,
    private readonly assetUsers: AssetUserService,
    private readonly permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      AssetId: new FormControl({ value: 0, disabled: true }, [Validators.required, Validators.min(1)]),
      PartyId: new FormControl({ value: 0, disabled: true }, [Validators.required, Validators.min(1)]),
      PartyLocationId: new FormControl(null, [Validators.required, Validators.min(1)]),
      CustomerDepartmentId: new FormControl(null, [Validators.required, Validators.min(1)]),
      AssetUserId: new FormControl(null, [Validators.required, Validators.min(1)]),
      AssignmentType: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      AssignedFrom: new FormControl(new Date(), [Validators.required]),
      AssignedTo: new FormControl(null),
      IsPrimary: new FormControl(true),
      AssignmentStatusId: new FormControl(null, [Validators.required, Validators.min(1)]),
      ReferenceType: new FormControl({ value: '', disabled: true }, [Validators.required]),
      ReferenceId: new FormControl({ value: '', disabled: true }, [Validators.required])
    });

    this.loggedInUserService.bindEntityLookup(this.form, 'PartyLocationId', 'party-locations',
      options => this.partyLocationOptions = options, error => this.error = String(error), this.destroyRef,
      { PartyId: 'PartyId' });
    this.loggedInUserService.bindEntityLookup(this.form, 'CustomerDepartmentId', 'customer-departments',
      options => this.departmentOptions = options, error => this.error = String(error), this.destroyRef,
      { PartyId: 'PartyId' });
    // The lookup exposes PartyId as its customer filter, ensuring custodians
    // from another customer cannot be selected from a delivery.
    this.loggedInUserService.bindEntityLookup(this.form, 'AssetUserId', 'asset-users',
      options => this.assetUserOptions = options, error => this.error = String(error), this.destroyRef,
      { PartyId: 'PartyId' });
    this.loadPicklists();
    this.form.get('AssetUserId')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((id: number) => this.loadSelectedAssetUser(id));
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form && (changes['context'] || changes['assignment'])) this.resetForm();
  }

  resetForm(): void {
    if (!this.form || !this.context) return;
    const item = this.assignment;
    this.error = '';
    this.form.reset({
      AssetId: this.context.AssetId,
      PartyId: this.context.PartyId,
      PartyLocationId: item?.PartyLocationId || null,
      CustomerDepartmentId: item?.CustomerDepartmentId || null,
      AssetUserId: item?.AssetUserId || null,
      AssignmentType: item?.AssignmentType || '',
      AssignedFrom: item?.AssignedFrom || new Date(),
      // An open-ended custody assignment is the safe and expected default.
      AssignedTo: item?.AssignedTo || null,
      IsPrimary: item?.IsPrimary ?? true,
      AssignmentStatusId: item?.AssignmentStatusId || this.defaultStatusId,
      ReferenceType: this.context.ReferenceType,
      ReferenceId: this.context.ReferenceId
    }, { emitEvent: true });
  }

  save(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Complete the required assignment details.';
      return;
    }

    const values = this.form.getRawValue();
    if (this.requiresDrivingEligibility && this.selectedUserCompliance?.RequiresDriverKyc && this.drivingEligibility !== 'Eligible') {
      this.error = 'This designated driver cannot be authorised until required KYC is verified, the licence is current, and the licence class is applicable.';
      return;
    }
    if (this.overlapsAnotherActivePrimary(values)) {
      this.error = 'This asset already has an overlapping active primary assignment. Edit that assignment or select a different date range.';
      return;
    }

    const payload = {
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.assignment?.Id || 0,
      RowVersionStr: this.assignment?.RowVersionStr,
      AssetId: this.context.AssetId,
      PartyId: this.context.PartyId,
      PartyLocationId: values.PartyLocationId,
      CustomerDepartmentId: values.CustomerDepartmentId,
      AssetUserId: values.AssetUserId,
      AssignmentType: values.AssignmentType,
      AssignedFrom: values.AssignedFrom,
      AssignedTo: values.AssignedTo || null,
      IsPrimary: values.IsPrimary === true,
      AssignmentStatusId: values.AssignmentStatusId,
      ReferenceType: this.context.ReferenceType,
      ReferenceId: this.context.ReferenceId,
      EffectiveFrom: this.assignment?.EffectiveFrom || new Date(),
      EffectiveTo: this.assignment?.EffectiveTo || null,
      RecordStatus: this.assignment?.RecordStatus || 'Active'
    } as IAssetAssignment;

    this.saving = true;
    const request = this.assignment?.Id
      ? this.assignments.update(this.assignment.Id, payload)
      : this.assignments.create(payload);
    request.subscribe({
      next: (response: any) => this.saved.emit(response?.data || payload),
      error: error => { this.error = String(error); this.saving = false; },
      complete: () => this.saving = false
    });
  }

  private get defaultStatusId(): number | null {
    const active = this.assignmentStatusOptions.find(option =>
      String(option.Value || '').toUpperCase() === 'ACTIVE' || String(option.Text || '').toUpperCase() === 'ACTIVE');
    return active?.Id || null;
  }

  get isDesignatedDriver(): boolean {
    return /(^|\s|-)DRIVER($|\s|-)/i.test(String(this.form?.get('AssignmentType')?.value || ''));
  }

  get requiresDrivingEligibility(): boolean {
    return this.isDesignatedDriver;
  }

  get drivingEligibility(): DrivingEligibility {
    if (this.selectedUserCompliance) return this.selectedUserCompliance.DrivingEligibilityStatus;
    return evaluateDrivingEligibility(this.selectedAssetUser, this.requiresDrivingEligibility, this.context?.RequiredDrivingLicenceClass);
  }

  get canOpenKycDetails(): boolean {
    return this.permissionService.hasAnyPermission(['asset.assetuserkyc.view', 'asset.assetuserkyc.update']);
  }

  get canCreateAssetUser(): boolean {
    return this.permissionService.hasPermission('security.assetuser.create');
  }

  createAssetUser(): void {
    if (!this.canCreateAssetUser) return;
    // A separate tab deliberately preserves the delivery form and its current selections.
    window.open('/dashboard/assetUsers/create', '_blank', 'noopener');
  }

  openKycDetails(): void {
    const assetUserId = Number(this.form?.get('AssetUserId')?.value || 0);
    if (!assetUserId || !this.canOpenKycDetails) return;
    // Keeping the editor in a separate tab preserves the active delivery dialog and its unsaved context.
    window.open(`/dashboard/assetUsers/edit/${assetUserId}`, '_blank', 'noopener');
  }

  private loadSelectedAssetUser(assetUserId: number | null): void {
    this.selectedAssetUser = null;
    this.selectedUserCompliance = null;
    if (!assetUserId || Number(assetUserId) <= 0) return;
    this.assetUserLoading = true;
    this.assetUsers.getById(Number(assetUserId)).subscribe({
      next: response => this.selectedAssetUser = response?.data || response || null,
      error: () => this.error = 'The selected user’s compliance status could not be loaded.',
      complete: () => this.assetUserLoading = false
    });
    this.assetUsers.getCompliance(Number(assetUserId), this.context.AssetId).subscribe({
      next: response => this.selectedUserCompliance = response?.data || response || null,
      error: () => this.error = 'The selected user’s compliance status could not be loaded.'
    });
  }

  private loadPicklists(): void {
    const load = () => {
      this.assignmentTypeOptions = this.loggedInUserService.getPicklistOptions('AssignmentType');
      this.assignmentStatusOptions = this.loggedInUserService.getPicklistOptions('AssetAssignmentStatus');
    };
    load();
    if (!this.assignmentTypeOptions.length || !this.assignmentStatusOptions.length) {
      this.loggedInUserService.loadPicklistCache().subscribe({
        next: () => {
          load();
          this.loadAssignmentStatusOptions();
        },
        error: error => this.error = String(error)
      });
      return;
    }
    this.loadAssignmentStatusOptions();
  }

  private loadAssignmentStatusOptions(): void {
    this.loggedInUserService.getAvailablePicklistOptions('AssetAssignmentStatus').subscribe({
      next: options => {
        this.assignmentStatusOptions = options;
        // The dialog is initialized before a fresh category request can complete.
        // Apply the Active default without overwriting an existing assignment.
        if (!this.assignment && !this.form.get('AssignmentStatusId')?.value) {
          this.form.patchValue({ AssignmentStatusId: this.defaultStatusId });
        }
      },
      error: error => this.error = String(error)
    });
  }

  private overlapsAnotherActivePrimary(candidate: any): boolean {
    if (!candidate.IsPrimary) return false;
    const candidateStart = this.asDate(candidate.AssignedFrom);
    const candidateEnd = this.asDate(candidate.AssignedTo) || new Date(8640000000000000);
    if (!candidateStart || candidateEnd < candidateStart) {
      this.error = 'Assignment end date cannot be before the start date.';
      return true;
    }
    return this.existingAssignments.some(item => {
      if (item.Id === this.assignment?.Id || !item.IsPrimary || String(item.RecordStatus || 'Active').toUpperCase() !== 'ACTIVE') return false;
      const itemStart = this.asDate(item.AssignedFrom);
      const itemEnd = this.asDate(item.AssignedTo) || new Date(8640000000000000);
      return !!itemStart && candidateStart <= itemEnd && itemStart <= candidateEnd;
    });
  }

  private asDate(value: unknown): Date | null {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
